/**
 * Centralized Security Utilities for Powerhub
 * Addresses OWASP Top 10: A01 (Access Control), A03 (Injection), A08 (Integrity), A09 (Logging), A10 (SSRF)
 */

import bcrypt from "bcryptjs";

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

