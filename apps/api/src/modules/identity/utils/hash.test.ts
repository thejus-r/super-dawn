import { describe, expect, it } from "vitest";
import { compareHash, hashPassword } from "./hash";

describe("Password hashing", () => {
  it("should generate a hash and salt", async () => {
    const { hash, salt } = await hashPassword("mySuperSecretPassword");

    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
    expect(hash).not.toBe("mySuperSecretPassword"); // Ensure it actually hashed
  });

  it("should return true for the correct password", async () => {
    const password = "correct-horse-battery-staple";
    const { hash, salt } = await hashPassword(password);

    const isValid = await compareHash(password, hash, salt);
    expect(isValid).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const { hash, salt } = await hashPassword("password123");

    const isValid = await compareHash("wrong-password", hash, salt);
    expect(isValid).toBe(false);
  });

  it("should return false if the salt is mismatched", async () => {
    const { hash } = await hashPassword("password123");
    const wrongSalt = "a".repeat(32); // Some random wrong salt

    const isValid = await compareHash("password123", hash, wrongSalt);
    expect(isValid).toBe(false);
  });
});
