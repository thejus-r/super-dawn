import type { CreateUserInput } from "../transport/dto/auth.dto"
import type { User } from "./entity/user.entity"

export type IAuthService = {
  createUser: (payload: CreateUserInput) => Promise<User>
  loginUser: (payload: CreateUserInput) => Promise<User>
  refreshTokens: () => void
}

export type IAuthRepository = {
  createUser: () => void
  loginUser: () => void
  refreshTokens: () => void
}
