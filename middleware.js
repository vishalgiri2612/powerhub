import { NextResponse } from "next/server";
import { parseSessionFromCookieEdge } from "@/lib/authEdge";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const rawCookieValue = request.cookies.get("ravtron_session")?.value;

  // Verify HMAC signature and parse session (Edge-compatible, returns null if tampered/missing)
  const session = rawCookieValue ? await parseSessionFromCookieEdge(rawCookieValue) : null;

  // 1. Protect /admin route: must be logged in as Administrator
  if (pathname.startsWith("/admin")) {
    if (!session || !session.isLoggedIn || session.role !== "Administrator") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect /profile route: must be logged in
  if (pathname.startsWith("/profile")) {
    if (!session || !session.isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect /checkout route: must be logged in
  if (pathname.startsWith("/checkout")) {
    if (!session || !session.isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/checkout/:path*"]
};
