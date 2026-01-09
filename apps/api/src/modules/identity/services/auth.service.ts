import type { IAuthRepository, IAuthService } from "../domain/auth.domain";
import type { IAuthStrategy, LoginMethodType } from "../domain/ports/auth-strategy.interface";
import type { AuthRepository } from "../infrastructure/repository/auth.repository";
import type { SessionRepository } from "../infrastructure/repository/session.repository";
import { EmailPasswordStrategy } from "../infrastructure/strategies";
import type { CreateUserInput } from "../transport/dto/auth.dto";

export class AuthService implements IAuthService {
	private authRepository: AuthRepository;
  private sessionRepository: SessionRepository;

  private authStratagies: Record<LoginMethodType, IAuthStrategy>

	constructor(
		authRepository: AuthRepository,
    sessionRepository: SessionRepository,
	) {
		this.authRepository = authRepository;
    this.sessionRepository = sessionRepository;

    this.authStratagies = {
      email: new EmailPasswordStrategy(this.authRepository),
      google: new EmailPasswordStrategy(this.authRepository)
    }
	}

  createUser = async ({ method, ...payload }: CreateUserInput) => {

    const strategy = this.authStratagies[method]

    if (!strategy) {
      throw new Error(`authentication strategy "${method}" not found`)
    }

    const user = await strategy.create(payload)

    return user

	};
  loginUser = async ({ method, ...payload }: CreateUserInput) => {

    const strategy = this.authStratagies[method]
    if (!strategy) {
      throw new Error(`authentication strategy "${method}" not found`)
    }

    const user = await strategy.create(payload)

    return user

	};
	refreshTokens = () => {};
}
