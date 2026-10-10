// DemoPilot AES-256-GCM Encryption Engine
// Law 3: "User credentials for authenticated demos must be encrypted with AES-256-GCM and never queried in plain text or logged."

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const DEFAULT_FALLBACK_KEY = "demopilot-secure-master-key-32b!"; // 32 bytes

function getMasterKey(): Buffer {
  const envKey = process.env.ENCRYPTION_MASTER_KEY;
  if (envKey) {
    if (envKey.length === 64) {
      // 32-byte hex string
      return Buffer.from(envKey, "hex");
    }
    // Hash to exactly 32 bytes
    return crypto.createHash("sha256").update(envKey).digest();
  }
  return crypto.createHash("sha256").update(DEFAULT_FALLBACK_KEY).digest();
}

export interface EncryptedPayload {
  cipherTextHex: string;
  ivHex: string;
  authTagHex: string;
}

/**
 * Encrypts arbitrary sensitive data (passwords, session cookies, API tokens)
 * using AES-256-GCM with authenticated verification tag.
 */
export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getMasterKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:cipherText
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts authenticated ciphertext and verifies the integrity tag.
 * Throws an error if the payload has been tampered with.
 */
export function decryptSecret(packedPayload: string): string {
  const parts = packedPayload.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format. Expected iv:tag:ciphertext.");
  }

  const [ivHex, tagHex, cipherHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const key = getMasterKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
