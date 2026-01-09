import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";
import { hash } from "./hash";
import {
  generateRefreshToken,
  sign,
  type TokenRecord,
  type TokenValidationResultType,
  tokenValidationResult,
  validate,
  validateRefreshToken,
} from "./token";

// Mocking environment config
vi.mock("@/config/env", () => ({
  default: {
    ACCESS_TOKEN_SECRET: "test-secret-key-123",
    ACCESS_TOKEN_EXPIRY: 3600, // 1 hour (number = seconds in jwt library)
  },
}));

describe("JWT Service", () => {
  const mockPayload = { userId: "user_123" };

  describe("sign()", () => {
    it("should generate valid JWT string", async () => {
      const token = await sign(mockPayload);

      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    });

    it("should use correct algorithm (HS512)", async () => {
      const token = await sign(mockPayload);

      const decoded = jwt.decode(token, { complete: true });

      expect(decoded?.header.alg).toBe("HS512");
    });
  });

  describe("validate()", () => {
    it("should return valid: true and payload", async () => {
      const token = await sign(mockPayload);

      const result = await validate(token);

      expect(result.valid).toBe(true);
      expect(result.payload).toMatchObject(mockPayload);
    });

    it("should return valid: false for a tampered token", async () => {
      const token = await sign(mockPayload);

      const tamperedToken = `${token.substring(0, token.length - 1)}X`;

      const result = await validate(tamperedToken);

      expect(result.valid).toBe(false);
      expect(result.payload).toBe(null);
    });

    it("should return valid: false for a token signed with a WRONG secret", async () => {
      // Manually sign a token with a different key
      const fakeToken = jwt.sign(mockPayload, "wrong-secret-key", {
        algorithm: "HS512",
      });

      const result = await validate(fakeToken);

      expect(result.valid).toBe(false);
      expect(result.payload).toBe(null);
    });

    it("should return valid: false for an EXPIRED token", async () => {
      // Manually sign a token with a different key
      const expiredToken = jwt.sign(mockPayload, "test-secret-key-123", {
        algorithm: "HS512",
        expiresIn: "-1s", // Negative expiration
      });
      const result = await validate(expiredToken);

      expect(result.valid).toBe(false);
      expect(result.payload).toBe(null);
    });

    it("should return valid: false for a completely malformed string", async () => {
      const result = await validate("this-is-not-a-token");

      expect(result.valid).toBe(false);
      expect(result.payload).toBeNull();
    });

    it("should return valid: false for a token with WRONG Algorithm (HS256)", async () => {
      // Security check: Ensure we don't accept 'none' or 'HS256' if we enforced HS512
      const weakToken = jwt.sign(mockPayload, "test-secret-key-123", {
        algorithm: "HS256",
      });

      const result = await validate(weakToken);

      expect(result.valid).toBe(false);
    });
  });
});

describe("refresh token", () => {
  describe("refresh token creation", () => {
    it("should generate a new refresh token record", async () => {
      const { token, hashedToken, expiresAt } = await generateRefreshToken();

      expect(token).toBeDefined();
      expect(expiresAt).toBeDefined();
      expect(hashedToken).toBeDefined();
    });

    it("should generate a url-safe token", async () => {
      const { token } = await generateRefreshToken();

      const urlSafe = token === encodeURIComponent(token);

      expect(urlSafe).toBe(true);
    });
  });

  describe("refresh token validation", async () => {
    const { token, hashedToken, expiresAt } = await generateRefreshToken();

    const tests: {
      name: string;
      token: string;
      tokenRecord: TokenRecord;
      expectedResult: TokenValidationResultType;
    }[] = [
      {
        name: "should return a valid state for a valid token",
        token: hash(token),
        tokenRecord: {
          hashedToken: hashedToken,
          expiresAt: expiresAt,
        },
        expectedResult: tokenValidationResult.Valid,
      },
      {
        name: "should return a expired state for an expired token",
        token: token,
        tokenRecord: {
          hashedToken: hashedToken,
          expiresAt: new Date(expiresAt.getTime() - 10000),
        },
        expectedResult: tokenValidationResult.Expired,
      },
      {
        name: "should return a invalid signature for a incoming tamperd token",
        token: `${token.substring(0, token.length - 1)}X`,
        tokenRecord: {
          hashedToken: hashedToken,
          expiresAt: expiresAt,
        },
        expectedResult: tokenValidationResult.InvalidSignature,
      },
      {
        name: "should return a token reuse token revoked more than grace period",
        token: hashedToken,
        tokenRecord: {
          hashedToken: hashedToken,
          expiresAt: expiresAt,
          revokedAt: new Date(Date.now() - 10200),
        },
        expectedResult: tokenValidationResult.ReuseDetected,
      },
      {
        name: "should return revoked_within_buffer for a refreshtoken request within grace period",
        token: hashedToken,
        tokenRecord: {
          hashedToken: hashedToken,
          expiresAt: expiresAt,
          revokedAt: new Date(Date.now() - 990),
        },
        expectedResult: tokenValidationResult.RevokedWithinBuffer,
      },
    ];

    tests.forEach((t) => {
      it(t.name, async () => {
        const result = await validateRefreshToken(t.token, t.tokenRecord);

        expect(result).toBe(t.expectedResult);
      });
    });
  });
});
