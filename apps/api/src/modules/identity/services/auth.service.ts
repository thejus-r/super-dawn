import { AppError } from "@/shared/utils/AppError";
import type { IAuthService } from "../domain/auth.domain";
import type { Session } from "../domain/entity/session.entity";
import type {
  IAuthStrategy,
  LoginMethodType,
} from "../domain/ports/auth-strategy.interface";
import type { ITokenProvider } from "../domain/ports/token-provider";
import { TokenProvider } from "../infrastructure/providers/token.provider";
import type { AuthRepository } from "../infrastructure/repository/auth.repository";
import type { SessionRepository } from "../infrastructure/repository/session.repository";
import { EmailPasswordStrategy } from "../infrastructure/strategies";
import type { CreateUserInput, LoginUserInput } from "../transport/dto/auth.dto";

export class AuthService implements IAuthService {
  private authRepository: AuthRepository;
  private sessionRepository: SessionRepository;

  private authStratagies: Record<LoginMethodType, IAuthStrategy>;

  private tokenProvider: ITokenProvider;

  constructor(
    authRepository: AuthRepository,
    sessionRepository: SessionRepository,
  ) {
    this.authRepository = authRepository;
    this.sessionRepository = sessionRepository;

    this.authStratagies = {
      email: new EmailPasswordStrategy(this.authRepository),
      google: new EmailPasswordStrategy(this.authRepository),
    };

    this.tokenProvider = new TokenProvider();
  }

  createUser = async ({ method, ...payload }: CreateUserInput) => {
    const strategy = this.authStratagies[method];

    if (!strategy) {
      throw new AppError({
        message: `authentication strategy "${method}" not supported`,
        statusCode: 404,
        code: "AUTH_STRATEGY_NOT_SUPPORTED",
      });
    }

    const newUser = await strategy.create(payload);

    const tokens = await this.#startSession(newUser.id);

    return {
      user: newUser,
      ...tokens,
    };
  };

  loginUser = async ({ method, ...payload }: LoginUserInput) => {
    const strategy = this.authStratagies[method];

    if (!strategy) {
      throw new AppError({
        message: `authentication strategy "${method}" not supported`,
        statusCode: 404,
        code: "AUTH_STRATEGY_NOT_SUPPORTED",
      });
    }
    const user = await strategy.authenticate(payload);
    const tokens = await this.#startSession(user.id);

    return {
      user: user,
      ...tokens,
    };
  };

  /*
  returns new token pairs, if the refresh token is valid
  otherwise based on the validation result, it handles the events and
  throws appropriate errors
  */

  // TODO: Change to AppError, once error middleware is added.

  refreshTokens = async (incomingRefreshToken: string) => {
    const hashedIncomingRefreshToken =
      this.tokenProvider.hashToken(incomingRefreshToken);

    const exisitingSessionRecord = await this.sessionRepository.findWithToken(
      hashedIncomingRefreshToken,
    );

    if (!exisitingSessionRecord) {
      throw new AppError({
        message: `token not found`,
        statusCode: 403,
        code: "TOKEN_NOT_FOUND",
      });
    }

    const { user, ...sessionRecord } = exisitingSessionRecord;

    const validationResult = await this.tokenProvider.validateRefreshToken(
      hashedIncomingRefreshToken,
      sessionRecord,
    );

    switch (validationResult) {
      case "VALID": {
        // Happy Path
        // We send a response
        const tokens = await this.#rotateTokens(sessionRecord);
        return { user, ...tokens };
      }
      // less happy path
      case "TOKEN_REUSED_WITHIN_BUFFER": {
        const tokens = await this.#refreshAccessToken(
          incomingRefreshToken,
          sessionRecord,
        );
        return { user, ...tokens };
      }
      // worst path
      case "TOKEN_REUSED": {
        await this.#handleTokenReuse(sessionRecord);
        throw new AppError({
          message: `token reused`,
          statusCode: 403,
          code: "TOKEN_REUSE_DETECTED",
        });
      }
      // sad paths
      case "EXPIRED": {
        throw new AppError({
          message: `token has expired, login back to get new token`,
          statusCode: 403,
          code: "TOKEN_EXPIRED",
        });
      }
      case "INVALID": {
        throw new AppError({
          message: `token provided is invalid`,
          statusCode: 403,
          code: "INVALID_TOKEN",
        });
      }
      default:
        throw new AppError({
          message: `authentication failed`,
          statusCode: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
    }
  };

  /*
  We revoke all the tokens
  */
  #handleTokenReuse = async ({ userId }: Session) => {
    console.warn(`[security] token reuse detected for: ${userId}`);
    await this.sessionRepository.revokeAll(userId);
    console.warn(`[security] revoked all tokens for: ${userId}`);
  };

  /*
  Revokes the exisiting token from the database and creates a new session
  in the database.

  Returns the new token pair (refreshToken & accessToken)
  */
  #rotateTokens = async ({ userId, id }: Session) => {
    const { token: refreshToken, hashedToken: hashedRefreshToken } =
      await this.tokenProvider.generateRefreshToken();
    const accessToken = await this.tokenProvider.generateAccessToken({
      userId: userId,
    });

    await this.sessionRepository.insertAndRevoke(
      {
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        userId: userId,
      },
      id,
    );

    return { refreshToken, accessToken };
  };

  /*
  When token is revoked within grace period, we only issue a new access-token
  this ensures better UX for the end-user and keeps the valid window of refresh-token secure
  */
  #refreshAccessToken = async (incomingToken: string, { userId }: Session) => {
    const accessToken = await this.tokenProvider.generateAccessToken({
      userId: userId,
    });

    return { refreshToken: incomingToken, accessToken };
  };

  // Helper function that generate the required tokens &
  // creates a session in the database
  // Returns the tokens.
  #startSession = async (userId: string) => {
    const { token: refreshToken, hashedToken: hashedRefreshToken } =
      await this.tokenProvider.generateRefreshToken();
    const accessToken = await this.tokenProvider.generateAccessToken({
      userId: userId,
    });

    await this.sessionRepository.create({
      userId: userId,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return { refreshToken, accessToken };
  };
}
