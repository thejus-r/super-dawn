import type { CreateUserInput } from "../transport/dto/auth.dto"
import type { User } from "./entity/user.entity"

type AuthResult = {
  user: User,
  refreshToken: string,
  accessToken: string
}

export type IAuthService = {
  createUser: (payload: CreateUserInput) => Promise<AuthResult>
  loginUser: (payload: CreateUserInput) => Promise<AuthResult>
  refreshTokens: (incomingToken: string) => Promise<AuthResult>
}

export type IAuthRepository = {
  createUser: () => void
  loginUser: () => void
  refreshTokens: () => void
}
