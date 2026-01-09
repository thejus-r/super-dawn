import { createHash, pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// Async for common error frist callback fn
const pbkdf2Async = promisify(pbkdf2);

// Create a hash and password for input password
const HASH_ITERATIONS = 1000;
const HASH_LENGHT = 64;
const DIGEST = "sha512";

export async function hashPassword(rawPassword: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await pbkdf2Async(
    rawPassword,
    salt,
    HASH_ITERATIONS,
    HASH_LENGHT,
    DIGEST,
  );

  const hash = derivedKey.toString("hex");

  return { hash, salt } as const;
}

// Validate hash, by comparing again, hash & salt
export async function compareHash(
  inputPassword: string,
  storedHash: string,
  salt: string,
) {
  const derivedKeyBuffer = await pbkdf2Async(
    inputPassword,
    salt,
    HASH_ITERATIONS,
    HASH_LENGHT,
    DIGEST,
  );

  const storedHashBuffer = Buffer.from(storedHash, "hex");

  // checking lengths to prevent errors from timingSafeEqual
  if (derivedKeyBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  // To prevent timing attacks
  return timingSafeEqual(storedHashBuffer, derivedKeyBuffer);
}

// create simple hash
const SIMPLE_HASH_ALG = "sha512";
export function hash(token: string) {
  const hash = createHash(SIMPLE_HASH_ALG);
  hash.update(token);

  return hash.digest("hex");
}

// create simple hash
export function checkHash(token: string, hashedToken: string) {
  const inputTokenHashed = hash(token);

  return inputTokenHashed === hashedToken;
}
