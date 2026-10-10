import { URL } from "url";
import dns from "dns/promises";
import net from "net";

const PRIVATE_SUBNETS = [
  // 127.0.0.0/8 (Loopback)
  { start: 0x7f000000, end: 0x7fffffff },
  // 10.0.0.0/8 (Private)
  { start: 0x0a000000, end: 0x0affffff },
  // 172.16.0.0/12 (Private)
  { start: 0xac100000, end: 0xac1fffff },
  // 192.168.0.0/16 (Private)
  { start: 0xc0a80000, end: 0xc0a8ffff },
  // 169.254.0.0/16 (Link-Local / AWS/GCP Metadata 169.254.169.254)
  { start: 0xa9fe0000, end: 0xa9feffff },
  // 0.0.0.0/8 (Current network)
  { start: 0x00000000, end: 0x00ffffff },
];

function ipToNumber(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function isPrivateIPv4(ip: string): boolean {
  if (!net.isIPv4(ip)) return false;
  const num = ipToNumber(ip);
  return PRIVATE_SUBNETS.some((range) => num >= range.start && num <= range.end);
}

export function isPrivateIPv6(ip: string): boolean {
  if (!net.isIPv6(ip)) return false;
  const normalized = ip.toLowerCase();
  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fe80:") || // Link-local
    normalized.startsWith("fc00:") || // Unique local
    normalized.startsWith("fd00:")
  );
}

export interface SSRFValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  errorMessage?: string;
}

/**
 * Validates a target URL against SSRF attacks and internal infrastructure leakage.
 */
export async function validateTargetUrl(rawUrl: string): Promise<SSRFValidationResult> {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, errorMessage: "URL cannot be empty." };
  }

  let parsed: URL;
  try {
    // Automatically add https:// if scheme is missing
    const withScheme = /^https?:\/\//i.test(rawUrl.trim())
      ? rawUrl.trim()
      : `https://${rawUrl.trim()}`;
    parsed = new URL(withScheme);
  } catch {
    return { isValid: false, errorMessage: "Invalid URL format." };
  }

  // Strictly enforce http or https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      isValid: false,
      errorMessage: `Unsupported protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and internal names
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname === "metadata.google.internal" ||
    hostname === "169.254.169.254"
  ) {
    return {
      isValid: false,
      errorMessage: "Access to private or local network hosts is prohibited for security.",
    };
  }

  // Check if hostname is directly an IP literal
  if (net.isIP(hostname)) {
    if (isPrivateIPv4(hostname) || isPrivateIPv6(hostname)) {
      return {
        isValid: false,
        errorMessage: "Target resolves to a private or restricted IP address.",
      };
    }
  }

  // Perform DNS resolution check to prevent DNS rebinding to private IPs
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const record of addresses) {
      if (
        (record.family === 4 && isPrivateIPv4(record.address)) ||
        (record.family === 6 && isPrivateIPv6(record.address))
      ) {
        return {
          isValid: false,
          errorMessage: `Security alert: Domain ${hostname} resolves to restricted internal IP ${record.address}.`,
        };
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "DNS resolution failed";
    return {
      isValid: false,
      errorMessage: `Could not resolve domain ${hostname}: ${message}`,
    };
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
  };
}
