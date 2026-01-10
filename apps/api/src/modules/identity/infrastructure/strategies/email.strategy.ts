import { AppError } from "@/shared/utils/AppError";
import {
  LoginMethod,
  type AuthPayload,
  type IAuthStrategy,
} from "../../domain/ports/auth-strategy.interface";
import { compareHash, hashPassword } from "../../utils/hash";
import type { AuthRepository } from "../repository/auth.repository";

export class EmailPasswordStrategy implements IAuthStrategy {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  create = async ({ email, password, firstName, lastName }: AuthPayload) => {
    if (!email || !password) throw new Error("missing credentials");

    const exisitingUser = await this.authRepository.findByEmail(email);

    if (exisitingUser) {
      throw new AppError({
        message: "user already exists",
        statusCode: 409,
        code: "USER_EXISTS",
      });
    }
    const { hash, salt } = await hashPassword(password);

    return await this.authRepository.create(
      {
        email: email,
        firstName: firstName ?? "User",
        lastName: lastName,
      },
      {
        provider: LoginMethod.email,
        providerId: email,
        password: hash,
        hashSalt: salt,
      },
    );
  };

  authenticate = async (payload: AuthPayload) => {
    const { email, password } = payload;
    if (!email || !password) throw new Error("missing credentials");

    const record = await this.authRepository.findByEmailWithIdentities(email);

    if (!record) {
      throw new AppError({
        message: "account not found",
        statusCode: 404,
        code: "ACCOUNT_NOT_FOUND",
      });
    }

    const { credentials, ...user } = record;

    const [cred] = credentials;
    if (!cred) {
      throw new AppError({
        message: "invalid credentials",
        statusCode: 403,
        code: "BAD_CREDENTIAL",
      });
    }
    if (cred.password && cred.hashSalt) {
      const isValid = await compareHash(password, cred.password, cred.hashSalt);

      if (!isValid) {
        throw new AppError({
          message: "invalid credentials",
          statusCode: 403,
          code: "BAD_CREDENTIAL",
        });
      }
      return user;
    }
    throw new AppError({
      message: "authentication failed",
      statusCode: 403,
      code: "AUTH_FAILED",
    });
  };
}
