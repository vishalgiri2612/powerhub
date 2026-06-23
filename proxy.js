import { NextResponse } from "next/server";

export function proxy(request) {
  const sessionCookie = request.cookies.get("ravtron_session")?.value;
  const url = request.nextUrl.clone();

  let session = null;
  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch (e) {
      console.error("Failed to parse session cookie in proxy", e);
    }
  }

  // 1. Protect /admin route: must be logged in as Administrator
  if (url.pathname.startsWith("/admin")) {
    if (!session || session.role !== "Administrator") {
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. Protect /profile route: must be logged in
  if (url.pathname.startsWith("/profile")) {
    if (!session || !session.isLoggedIn) {
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"]
};
