import { LoginMethod, type AuthPayload, type IAuthStrategy } from "../../domain/ports/auth-strategy.interface"
import { compareHash, hashPassword } from "../../utils/hash"
import type { AuthRepository } from "../repository/auth.repository"

export class EmailPasswordStrategy implements IAuthStrategy{
  private authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  create = async ({ email, password, firstName, lastName }: AuthPayload) => {
    if (!email || !password) throw new Error("missing credentials");

    const exisitingUser = await this.authRepository.findByEmail(email)

    if (exisitingUser) {
      throw new Error("the user already exists")
    }
    const { hash, salt } = await hashPassword(password)

    return await this.authRepository.create({
      email: email,
      firstName: firstName ?? "User",
      lastName: lastName
    }, {
      provider: LoginMethod.email,
      providerId: email,
      password: hash,
      hashSalt: salt
    })
  }

  authenticate = async (payload: AuthPayload) => {
    const { email, password } = payload
    if (!email || !password) throw new Error("missing credentials");

    const record = await this.authRepository.findByEmailWithIdentities(email)

    if (!record) throw new Error("invalid credentials")

    const { credentials, ...user } = record;

    const [cred] = credentials
    if (!cred) {
      throw new Error("invalid credentials")
    }
    if (cred.password && cred.hashSalt) {
      const isValid = await compareHash(password, cred.password, cred.hashSalt)

      if (!isValid) {
        throw new Error("invalid credentials")
      }
      return user
    }
    throw new Error("authentication failed");
  }
}
