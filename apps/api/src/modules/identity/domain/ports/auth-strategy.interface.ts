import type { User } from "../entity/user.entity";

export const LoginMethod = {
  email: "email",
  google: "google"
} as const;

export type LoginMethodType = (typeof LoginMethod)[keyof typeof LoginMethod]

export interface AuthPayload {
  email?: string,
  password?: string
  token?: string;
  firstName?: string;
  lastName?: string
}

export interface IAuthStrategy {
  authenticate: (data: AuthPayload) => Promise<User>
  create: (data: AuthPayload) => Promise<User>
}
