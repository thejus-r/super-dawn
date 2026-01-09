import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { TokenProvider } from './token.provider';
import type { Session } from '../../domain/entity/session.entity';
import { RefreshTokenValidationResult } from '../../domain/ports/token-provider';

describe("Token Provider", () => {
  let tokenProvider: TokenProvider

  const MOCK_NOW = new Date('2024-01-01T12:00:00Z').getTime();
  const GRACE_PERIOD_MS = 1000 * 10; // 10 seconds

  // Setup Environment Variables specifically for this test suite
  vi.stubEnv('ACCESS_TOKEN_SECRET', 'test-secret');

  beforeEach(() => {
    // 1. Freeze time before every test
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_NOW);

    tokenProvider = new TokenProvider();
  });

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("validate refresh token", () => {

    const VALID_HASH_IN_DB = 'deadbeef1234';
    const INVALID_INCOMING_HASH = 'badbadbad1234';

    it("should return VALID when token matches, is not expired, and not revoked", async () => {
      const session = {
        token: VALID_HASH_IN_DB,
        expiresAt: new Date(MOCK_NOW + 10000), // Expires in future (10s)
        revokedAt: null,
      } as unknown as Session;

      const result = await tokenProvider.validateRefreshToken(VALID_HASH_IN_DB, session);

      expect(result).toBe(RefreshTokenValidationResult.valid)
    })

    it("should return INVALID when token does not match but is not expired, and not revoked", async () => {
      const session = {
        token: VALID_HASH_IN_DB,
        expiresAt: new Date(MOCK_NOW + 10000), // Expires in future (10s)
        revokedAt: null,
      } as unknown as Session;

      const result = await tokenProvider.validateRefreshToken(INVALID_INCOMING_HASH, session);

      expect(result).toBe(RefreshTokenValidationResult.invalid)
    })

    it('should return EXPIRED when expiresAt is in the past', async () => {
      const session = {
        token: VALID_HASH_IN_DB,
        expiresAt: new Date(MOCK_NOW - 1), // Expired 1ms ago
        revokedAt: null,
      } as unknown as Session;

      const result = await tokenProvider.validateRefreshToken(VALID_HASH_IN_DB, session);

      expect(result).toBe(RefreshTokenValidationResult.expired);
    });

    it('should return REUSED_WITHIN_BUFFER if revoked recently (inside grace period)', async () => {
      // Revoked 5 seconds ago (Grace period is 10s)
      const revokedFiveSecondsAgo = new Date(MOCK_NOW - 5000);

      const session = {
        token: VALID_HASH_IN_DB,
        expiresAt: new Date(MOCK_NOW + 10000), // Valid expiry
        revokedAt: revokedFiveSecondsAgo,
      } as unknown as Session;

      const result = await tokenProvider.validateRefreshToken(VALID_HASH_IN_DB, session);

      expect(result).toBe(RefreshTokenValidationResult.reusedWithinBuffer);
    });

    it('should return REUSED if revoked long ago (outside grace period)', async () => {
      // Revoked 11 seconds ago (Grace period is 10s)
      const revokedLongAgo = new Date(MOCK_NOW - (GRACE_PERIOD_MS + 1000));

      const session = {
        token: VALID_HASH_IN_DB,
        expiresAt: new Date(MOCK_NOW + 10000),
        revokedAt: revokedLongAgo,
      } as unknown as Session;

      const result = await tokenProvider.validateRefreshToken(VALID_HASH_IN_DB, session);

      expect(result).toBe(RefreshTokenValidationResult.reused);
    });

    it('should prioritize INVALID over EXPIRED status', async () => {
      // Security Check: Don't reveal a token is expired if the hash is wrong
      const session = {
        token: VALID_HASH_IN_DB,
        expiresAt: new Date(MOCK_NOW - 10000), // Expired
        revokedAt: null,
      } as unknown as Session;

      // Pass the WRONG hash
      const result = await tokenProvider.validateRefreshToken(INVALID_INCOMING_HASH, session);

      expect(result).toBe(RefreshTokenValidationResult.invalid);
    });
  })
})
