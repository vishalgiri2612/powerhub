/**
 * Sliding Window In-Memory Rate Limiter for Powerhub API Endpoints
 * Prevents brute-force attacks and request flooding.
 */

const tracker = new Map();

// Periodic cleanup every 5 minutes to prevent memory accumulation
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of tracker.entries()) {
      if (now > record.resetTime) {
        tracker.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Check and record a rate limit attempt.
 * @param {string} key - Identifier (e.g., client IP or email)
 * @param {number} limit - Maximum allowed requests in window
 * @param {number} windowMs - Time window in milliseconds (default: 1 minute)
 * @returns {{ success: boolean, remaining: number, resetTime: number }}
 */
export function rateLimit(key, limit = 5, windowMs = 60 * 1000) {
  const now = Date.now();
  let record = tracker.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    tracker.set(key, record);
    return {
      success: true,
      remaining: limit - 1,
      resetTime: record.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Helper to extract client IP from Next.js request headers
 * @param {Request} request 
 * @returns {string}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
