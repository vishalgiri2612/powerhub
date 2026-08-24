import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("ravtron_session")?.value;

  let session = null;
  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch (e) {
      console.error("Failed to parse session cookie in middleware:", e);
    }
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"]
};
