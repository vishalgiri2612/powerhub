/**
 * Centralized Security Utilities for Powerhub
 * Addresses OWASP Top 10: A01 (Access Control), A03 (Injection), A08 (Integrity), A09 (Logging), A10 (SSRF)
 */

import bcrypt from "bcryptjs";
import dns from "dns";

// Configure fallback DNS resolvers for reliable server-side domain resolution
try {
  if (dns && typeof dns.setServers === "function") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
} catch (e) {
  // Ignore if environment overrides DNS configuration
}

/**
 * Escapes user input strings before embedding them into RegExp objects to prevent NoSQL Injection and ReDoS.
 * @param {string} str - User provided input string
 * @returns {string} Safe string with regex special characters escaped
 */
export function escapeRegex(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Sanitizes and normalizes email addresses.
 * @param {string} email 
 * @returns {string}
 */
export function sanitizeEmail(email) {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

/**
 * Known disposable / temporary email domains to reject during account creation.
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "tempmail.net",
  "tempmail.dev",
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "sharklasers.com",
  "dispostable.com",
  "trashmail.com",
  "trashmail.net",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "getnada.com",
  "nada.ltd",
  "fakemail.net",
  "fakeinbox.com",
  "throwawaymail.com",
  "crazymailing.com",
  "generator.email",
  "maildrop.cc",
  "mytemp.email",
  "inboxkitten.com",
  "binkmail.com",
  "disposablemail.com",
  "mohmal.com",
  "byom.de",
  "dropmail.me",
  "minutemail.net",
  "temp-mail.ru"
]);

/**
 * Checks whether an email address belongs to a known disposable email domain.
 * @param {string} email 
 * @returns {boolean} True if disposable/temporary, false otherwise
 */
export function isDisposableEmail(email) {
  if (typeof email !== "string" || !email.includes("@")) return false;
  const parts = email.trim().toLowerCase().split("@");
  const domain = parts[parts.length - 1];
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Performs a server-side DNS MX record check for an email domain to verify it can receive emails.
 * @param {string} email 
 * @returns {Promise<boolean>} True if MX records exist or check passes; false if non-existent or no MX record.
 */
export async function verifyEmailDomainMx(email) {
  if (typeof email !== "string" || !email.includes("@")) return false;
  const parts = email.trim().toLowerCase().split("@");
  const domain = parts[parts.length - 1];

  if (!domain || domain.length < 3) return false;

  try {
    const dnsPromises = dns.promises || dns;
    if (!dnsPromises || typeof dnsPromises.resolveMx !== "function") {
      return true; // Fallback gracefully if dns module is unavailable
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DNS_MX_TIMEOUT")), 3000)
    );

    const mxRecords = await Promise.race([
      dnsPromises.resolveMx(domain),
      timeoutPromise
    ]);

    return Array.isArray(mxRecords) && mxRecords.length > 0;
  } catch (err) {
    const code = String(err.code || "").toUpperCase();
    const msg = String(err.message || "").toUpperCase();
    
    // Explicitly reject if domain doesn't exist or has no MX record
    if (
      code === "ENOTFOUND" ||
      code === "ENODATA" ||
      code === "NXDOMAIN" ||
      code === "SERVFAIL" ||
      msg.includes("ENOTFOUND") ||
      msg.includes("ENODATA") ||
      msg.includes("NXDOMAIN") ||
      msg.includes("SERVFAIL")
    ) {
      return false;
    }
    // For network timeouts or system DNS query errors, log warning and allow fallback
    logSecurityEvent("DNS_MX_CHECK_WARNING", { domain, error: err.message, code: err.code });
    return true;
  }
}

/**
 * Validates uploaded files against allowed MIME types and max size limits.
 * Default max file size: 5 MB (5 * 1024 * 1024 bytes)
 */
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml"
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".svg"
]);

export function validateFileUpload(file, maxSizeBytes = 5 * 1024 * 1024) {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds maximum allowed limit of ${Math.round(maxSizeBytes / (1024 * 1024))}MB` };
  }

  const mimeType = (file.type || "").toLowerCase();
  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    return { valid: false, error: `Invalid file type: ${mimeType}. Only images (JPEG, PNG, WebP, GIF, AVIF, SVG) are permitted.` };
  }

  const name = file.name || "";
  const extMatch = name.match(/\.[0-9a-z]+$/i);
  const ext = extMatch ? extMatch[0].toLowerCase() : "";

  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Invalid file extension: ${ext}. Permitted extensions: ${Array.from(ALLOWED_EXTENSIONS).join(", ")}` };
  }

  return { valid: true };
}

/**
 * Structured Security Event Logger for Auditing & Monitoring (OWASP A09)
 * @param {string} event - Description of event (e.g., 'AUTH_FAILED', 'UNAUTHORIZED_ACCESS')
 * @param {Object} details - Additional contextual metadata
 */
export function logSecurityEvent(event, details = {}) {
  const timestamp = new Date().toISOString();
  console.warn(`[SECURITY AUDIT] [${timestamp}] [EVENT: ${event}]`, JSON.stringify(details));
}

/**
 * SSRF Prevention: Checks if a target URL domain belongs to an allowed whitelist.
 * @param {string} urlString 
 * @param {Array<string>} allowedDomains 
 * @returns {boolean}
 */
export function isAllowedDomain(urlString, allowedDomains = ["googleapis.com", "google.com", "accounts.google.com", "cloudinary.com"]) {
  try {
    const parsed = new URL(urlString);
    return allowedDomains.some((domain) => parsed.hostname === domain || parsed.hostname.endsWith("." + domain));
  } catch (e) {
    return false;
  }
}

/**
 * Secure Password Hashing using bcryptjs
 * @param {string} password 
 * @param {number} saltRounds 
 * @returns {Promise<string>} Hashed password string
 */
export async function hashPassword(password, saltRounds = 10) {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string.");
  }
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash.
 * @param {string} password 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    return false;
  }
}

/**
 * Honeypot & Bot Detection verification helper.
 * Rejects submission if honeypot field is filled.
 * @param {Object} body - Request body object
 * @param {string} honeypotField - Name of hidden trap field (default: 'website')
 * @returns {{ isBot: boolean, reason?: string }}
 */
export function verifyBotProtection(body = {}, honeypotField = "website") {
  if (body[honeypotField] && body[honeypotField].trim() !== "") {
    logSecurityEvent("BOT_HONEYPOT_TRIGGERED", { field: honeypotField });
    return { isBot: true, reason: "Honeypot trigger" };
  }
  return { isBot: false };
}

