// DemoPilot SSRF Defense Test Suite
// Verifies Law 3: Security & Untrusted Input Isolation

import { validateTargetUrl, isPrivateIPv4, isPrivateIPv6 } from "../src/lib/security/ssrf";

async function runSSRFTests() {
  console.log("▶ Running SSRF Defense Test Suite...");
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

  // 1. Private IPv4 Subnet Tests (RFC 1918)
  assert(isPrivateIPv4("127.0.0.1"), "Blocks loopback 127.0.0.1");
  assert(isPrivateIPv4("10.0.0.1"), "Blocks 10.0.0.0/8 private network");
  assert(isPrivateIPv4("172.16.0.5"), "Blocks 172.16.0.0/12 private network");
  assert(isPrivateIPv4("192.168.1.1"), "Blocks 192.168.0.0/16 private network");
  assert(isPrivateIPv4("169.254.169.254"), "Blocks AWS/GCP cloud metadata IP");
  assert(!isPrivateIPv4("8.8.8.8"), "Allows public IPv4 (8.8.8.8)");
  assert(!isPrivateIPv4("104.21.45.12"), "Allows Cloudflare public IP");

  // 2. Private IPv6 Tests
  assert(isPrivateIPv6("::1"), "Blocks IPv6 loopback ::1");
  assert(isPrivateIPv6("fe80::1"), "Blocks IPv6 link-local fe80::1");
  assert(isPrivateIPv6("fc00::1"), "Blocks IPv6 unique local fc00::1");
  assert(!isPrivateIPv6("2606:4700::6810:2d0c"), "Allows public IPv6");

  // 3. URL Validation Tests
  const res1 = await validateTargetUrl("http://localhost:3000");
  assert(!res1.isValid, "Rejects localhost");

  const res2 = await validateTargetUrl("http://127.0.0.1:8080/admin");
  assert(!res2.isValid, "Rejects 127.0.0.1");

  const res3 = await validateTargetUrl("http://169.254.169.254/latest/meta-data");
  assert(!res3.isValid, "Rejects cloud metadata endpoint");

  const res4 = await validateTargetUrl("ftp://example.com");
  assert(!res4.isValid, "Rejects non-HTTP(S) schemes");

  const res5 = await validateTargetUrl("https://github.com");
  assert(res5.isValid, "Permits valid public HTTPS website (github.com)");

  const res6 = await validateTargetUrl("linear.app");
  assert(res6.isValid, "Auto-prepends https:// to naked public domains");

  console.log(`\nSSRF Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runSSRFTests().catch((err) => {
  console.error("SSRF test suite execution error:", err);
  process.exit(1);
});
