import { randomBytes } from "node:crypto";
import { promisify } from "node:util";
import jwt from "jsonwebtoken";

import { hash } from "./hash"

// ************************ JWT TOKEN ************************

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


const ACCESS_TOKEN_SECRET = "change_in_prod"; // without secret, server wont start
const ACCESS_TOKEN_EXPIRY = 3600 // in seconds
const ALGORITHM = "HS512";


export async function sign(payload: object) {
  const token = await signAsync(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: ALGORITHM, // Stronger than the default HS256
  });

  return token;
}

export async function validate(token: string) {
  try {
    // If verification fails, this throws an error
    const decoded = await verifyAsync(token, ACCESS_TOKEN_SECRET, {
      algorithms: [ALGORITHM], // Explicitly allow only our algorithm
    });

    return { valid: true, payload: decoded };
  } catch (error) {
    // Token is expired, malformed, or signature is wrong
    console.log(error);
    return { valid: false, payload: null };
  }
}


// ************************ REFRESH TOKEN ************************

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7d
const REFRESH_TOKEN_LENGTH = 24;
const TOKEN_GRACE_PERIOD = 10000; // 10s
const asyncRandomBytes = promisify(randomBytes);

export async function generateRefreshToken() {
  // url safe random token
  const token = (await asyncRandomBytes(REFRESH_TOKEN_LENGTH)).toString(
    "base64url",
  );
  const hashedToken = hash(token);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

  return { token, hashedToken, expiresAt };
}


export interface TokenRecord {
  hashedToken: string;
  expiresAt: Date;
  revokedAt?: Date | null;
}

export const tokenValidationResult = {
  Valid: "VALID",
  Expired: "EXPIRED",
  InvalidSignature: "INVALID_SIGNATURE",
  ReuseDetected: "REUSE_DETECTED",
  RevokedWithinBuffer: "REVOKED_WITHIN_BUFFER",
} as const;

export type TokenValidationResultType =
(typeof tokenValidationResult)[keyof typeof tokenValidationResult];

export async function validateRefreshToken(
  incomingToken: string,
  record: TokenRecord,
): Promise<TokenValidationResultType> {
  const now = Date.now();

  // expired token
  if (record.expiresAt.getTime() < now) {
    return tokenValidationResult.Expired;
  }

  // matching hash
  const isMatch = incomingToken === record.hashedToken;

  if (!isMatch) {
    return tokenValidationResult.InvalidSignature;
  }

  // check revocation & buffer period
  if (record.revokedAt) {
    const timeSinceRevocation = now - record.revokedAt.getTime();
    console.log("time diff", timeSinceRevocation);
    if (timeSinceRevocation < TOKEN_GRACE_PERIOD) {
      return tokenValidationResult.RevokedWithinBuffer;
    } else {
      return tokenValidationResult.ReuseDetected;
    }
  }

  // if all passes token is still active
  return tokenValidationResult.Valid;
}
