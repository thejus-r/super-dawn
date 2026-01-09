import type { Session } from "../entity/session.entity"

export interface AccessTokenPayload {
  userId: string,
  organizationId?: string
}

export const RefreshTokenValidationResult = {
  valid: "VALID",
  expired: "EXPIRED",
  reused: "TOKEN_REUSED",
  reusedWithinBuffer: "TOKEN_REUSED_WITHIN_BUFFER",
  invalid: "INVALID"
} as const

export type RefreshTokenValidationStatus = typeof RefreshTokenValidationResult[keyof typeof RefreshTokenValidationResult];

export interface ITokenProvider {
  generateAccessToken: (payload: AccessTokenPayload) => Promise<string>
  verifyAccessToken: (token: string) => Promise<AccessTokenPayload | null>
  generateRefreshToken: () => Promise<{ token: string, hashedToken: string }>
  validateRefreshToken: (incomingHashedToken: string, exisitingRecord: Session) => Promise<RefreshTokenValidationStatus>
  hashToken: (input: string) => string
}
