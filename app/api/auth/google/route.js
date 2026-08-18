import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { OAuth2Client } from "google-auth-library";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "538059283255-qc41jgp3n3287bgmcs16efjgdt2fcb1s.apps.googleusercontent.com";
const client = new OAuth2Client(googleClientId);

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { credential, access_token } = body;

    let email = "";
    let name = "";
    let picture = "";

    if (credential) {
      // Verify Google ID Token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return NextResponse.json({ error: "Invalid Google credential token." }, { status: 400 });
      }
      email = payload.email;
      name = payload.name || payload.given_name || "RAVTRON User";
      picture = payload.picture || "";
    } else if (access_token) {
      // Fetch user profile from Google UserInfo API
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch Google profile with access token." }, { status: 400 });
      }
      const profile = await res.json();
      email = profile.email;
      name = profile.name || profile.given_name || "RAVTRON User";
      picture = profile.picture || "";
    } else {
      return NextResponse.json({ error: "Google credential or access token is required." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Could not retrieve email from Google account." }, { status: 400 });
    }

    const inputEmail = email.trim().toLowerCase();
    const adminEnvEmail = (process.env.ADMIN_EMAIL || "ravtron@admin.com").trim().toLowerCase();
    const adminEnvName = process.env.ADMIN_NAME || "Visha Rawat";

    // Search for existing user in MongoDB
    let existingUser = await User.findOne({ email: { $regex: new RegExp(`^${inputEmail}$`, "i") } });

    const isAdmin = inputEmail === adminEnvEmail || (existingUser && existingUser.role === "Administrator");
    const roleToSet = isAdmin ? "Administrator" : "Customer";

    if (!existingUser) {
      existingUser = await User.create({
        name: name || (isAdmin ? adminEnvName : "RAVTRON Client"),
        email: inputEmail,
        role: roleToSet,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        active: true
      });
    }

    if (existingUser.active === false) {
      return NextResponse.json({ error: "Access denied. Your profile has been deactivated. Please contact support." }, { status: 403 });
    }

    const sessionUser = {
      name: existingUser.name || name,
      email: existingUser.email,
      phone: "",
      avatar: picture || "",
      joinDate: existingUser.joinDate,
      role: existingUser.role,
      isLoggedIn: true
    };

    const isProduction = process.env.NODE_ENV === "production";
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttps = forwardedProto === "https" || request.url.startsWith("https://");
    const secure = isProduction && isHttps;

    const cookieStore = await cookies();
    cookieStore.set({
      name: "ravtron_session",
      value: encodeURIComponent(JSON.stringify(sessionUser)),
      httpOnly: true,
      secure,
      path: "/",
      maxAge: 345600, // 4 days
      sameSite: "lax"
    });

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error) {
    console.error("Google Auth Route Error:", error);
    return NextResponse.json({ error: error.message || "Google authentication failed." }, { status: 500 });
  }
}
