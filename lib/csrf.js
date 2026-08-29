// Why Origin checking works:
//   - Browsers send the `Origin` header on all cross-origin fetch() requests.
//   - A malicious site at evil.com CANNOT spoof the Origin header (browser enforced).
//   - Same-origin requests (from our own frontend) always pass this check.
//   - Combined with SameSite=Lax cookies, this provides defense-in-depth CSRF protection.
//
// When is this needed?
//   - All state-changing requests (POST, PUT, DELETE, PATCH) on admin/sensitive routes.
//   - GET requests are safe by convention and don't need CSRF protection.

const ALLOWED_ORIGINS = (() => {
  const origins = new Set();

  // Always allow localhost in any environment (for development)
  origins.add("http://localhost:3000");
  origins.add("http://localhost");

  // Add production domain from environment variable (preferred)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    origins.add(process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""));
  }

  // Fallback: known production domain
  origins.add("https://powerhub-umber.vercel.app");

  return origins;
})();

/**
 * Validates that a state-changing request originates from this application.
 * Call this at the top of POST / PUT / DELETE API handlers.
 *
 * @param {Request} request - The incoming Next.js request object.
 * @returns {{ ok: boolean, response: NextResponse | null }}
 *   - `ok: true`  → request is safe to proceed
 *   - `ok: false` → return the `response` object (HTTP 403) immediately
 */
export function verifyCsrfOrigin(request) {
  // Skip CSRF check in test environments
  if (process.env.NODE_ENV === "test") {
    return { ok: true, response: null };
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Derive the origin from the Referer header as a fallback
  // (some browsers omit Origin on same-site navigations)
  let effectiveOrigin = origin;
  if (!effectiveOrigin && referer) {
    try {
      effectiveOrigin = new URL(referer).origin;
    } catch {
      effectiveOrigin = null;
    }
  }

  // If neither header is present, this is likely a server-side or tool request.
  // Allow it — an attacker cannot suppress Origin on a browser-originated request.
  if (!effectiveOrigin) {
    return { ok: true, response: null };
  }

  if (!ALLOWED_ORIGINS.has(effectiveOrigin)) {
    const { NextResponse } = require("next/server");
    console.warn(`[SEC-016] CSRF origin rejected: ${effectiveOrigin}`);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Forbidden: Cross-site request blocked." },
        { status: 403 }
      )
    };
  }

  return { ok: true, response: null };
}
