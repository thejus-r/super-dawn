import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util";
import jwt from 'jsonwebtoken';
import { AppError } from "@/shared/utils/AppError";
import type { Session } from '../../domain/entity/session.entity';
import { type AccessTokenPayload, type ITokenProvider, RefreshTokenValidationResult, type RefreshTokenValidationStatus } from '../../domain/ports/token-provider';

// converting to async functions with promisify
const signAsync = promisify<object, jwt.Secret, jwt.SignOptions, string>(
  jwt.sign,
);

// converting to async functions with promisify
const verifyAsync = promisify<
  string,
  jwt.Secret,
  jwt.VerifyOptions,
  jwt.JwtPayload
>(jwt.verify);

const asyncRandomBytes = promisify(randomBytes);

// CONSTANTS
const REFRESH_TOKEN_GRACE_PERIOD = 10 // 10 seconds

export class TokenProvider implements ITokenProvider {
  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRY: number;
  private readonly ALGORITHM = "HS512";

  constructor() {
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
    this.ACCESS_TOKEN_EXPIRY =  1000 * 60 * 15;
  }

  generateAccessToken = async (payload: AccessTokenPayload): Promise<string> => {
    return await signAsync(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      algorithm: this.ALGORITHM
    })
  }

  verifyAccessToken = async (token: string): Promise<AccessTokenPayload> => {
    try {
      return await verifyAsync(token, this.ACCESS_TOKEN_SECRET, {
        algorithms: [ this.ALGORITHM ]
      }) as AccessTokenPayload
    } catch (error) {
      console.error(error)
      throw new AppError({
        message: "invalid/expired token",
        statusCode: 403
      })
    }
  }

  generateRefreshToken = async () => {
    const tokenBuffer = await asyncRandomBytes(32)
    const token = tokenBuffer.toString("base64url") // making token url safe
    const hashedToken = this.hashToken(token)
    return { token, hashedToken }
  }

  // Uses the hashedIncoming token and token record from DB
  // to validate the status of the token
  //
  // this is crutial, as it can detected token-reuse
  validateRefreshToken = async (incomingHashedToken: string, exisitingRecord: Session): Promise<RefreshTokenValidationStatus> => {
    const { token: tokenFromDB, expiresAt, revokedAt } = exisitingRecord
    const isValid = this.#compareHash(incomingHashedToken, tokenFromDB)
    const now = Date.now() / 1000

    if (!isValid) {
      return RefreshTokenValidationResult.invalid
    }
    if (expiresAt.getTime() < now) {
      return RefreshTokenValidationResult.expired
    }

    if (revokedAt) {

      const revokedTime = revokedAt.getTime() / 1000
      if (now - revokedTime < REFRESH_TOKEN_GRACE_PERIOD) {
        return RefreshTokenValidationResult.reusedWithinBuffer
      } else {
        return RefreshTokenValidationResult.reused
      }
    }

    return RefreshTokenValidationResult.valid
  }

  // TODO: upgrade to async hashing functions
  hashToken = (input: string) => {
    const hash = createHash("sha512") // creates an Hash Object
    hash.update(input)

    return hash.digest("hex")
  }

  // We compare the buffers in timingSafeEqual
  // to prevent timing attacks
  #compareHash = (a: string, b: string) => {
    const bufferA = Buffer.from(a, "hex")
    const bufferB = Buffer.from(b, "hex")

    if (bufferA.length !== bufferB.length) {
      // to use the same CPU cycle as comparing both buffers
      timingSafeEqual(bufferA, bufferA)
      return false
    }
    return timingSafeEqual(bufferA, bufferB)
  }

}
