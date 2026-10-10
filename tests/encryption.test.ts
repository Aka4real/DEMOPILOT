// DemoPilot Encryption Test Suite
// Verifies Law 3: AES-256-GCM authenticated cipher and tamper resistance

import { encryptSecret, decryptSecret } from "../src/lib/security/encryption";

function runEncryptionTests() {
  console.log("▶ Running AES-256-GCM Encryption Test Suite...");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Basic Encryption & Decryption Roundtrip
  const secretPassword = "SuperSecretStagingPassword123!@#";
  const encrypted = encryptSecret(secretPassword);
  assert(encrypted !== secretPassword, "Ciphertext is distinct from plaintext");
  assert(encrypted.split(":").length === 3, "Output format is packed iv:authTag:ciphertext");

  const decrypted = decryptSecret(encrypted);
  assert(decrypted === secretPassword, "Decrypted text perfectly matches original plaintext");

  // 2. Cookie string roundtrip
  const cookiePayload = "session_token=eyJhbGciOiJIUzI1NiJ9.test; org_id=acme-corp; secure=true";
  const encryptedCookie = encryptSecret(cookiePayload);
  const decryptedCookie = decryptSecret(encryptedCookie);
  assert(decryptedCookie === cookiePayload, "Multi-cookie session string decrypts accurately");

  // 3. Tamper Resistance
  let tamperDetected = false;
  try {
    const parts = encrypted.split(":");
    // Mutate the ciphertext by altering the last hex character
    const tamperedCipher = parts[2].slice(0, -1) + (parts[2].endsWith("a") ? "b" : "a");
    decryptSecret(`${parts[0]}:${parts[1]}:${tamperedCipher}`);
  } catch {
    tamperDetected = true;
  }
  assert(tamperDetected, "GCM Auth Tag rejects tampered ciphertext with verification failure");

  console.log(`\nEncryption Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runEncryptionTests();
