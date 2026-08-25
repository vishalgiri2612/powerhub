import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { escapeRegex, sanitizeEmail, logSecurityEvent } from "@/lib/security";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const inputEmail = sanitizeEmail(email);
    const safeRegex = new RegExp(`^${escapeRegex(inputEmail)}$`, "i");

    const isProduction = process.env.NODE_ENV === "production";
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttps = forwardedProto === "https" || request.url.startsWith("https://");
    const secure = isProduction && isHttps;

    const adminEnvEmail = sanitizeEmail(process.env.ADMIN_EMAIL || "officerequirementsgurgaon@gmail.com");
    const adminEnvPassword = process.env.ADMIN_PASSWORD || "@Ravtron1947";
    const adminEnvName = process.env.ADMIN_NAME || "Ravtron";

    let existingUser = null;
    try {
      await dbConnect();
      existingUser = await User.findOne({ email: { $regex: safeRegex } });
    } catch (dbErr) {
      console.warn("MongoDB connection notice during login:", dbErr.message);
    }

    const isAdminLogin = inputEmail === adminEnvEmail || (existingUser && existingUser.role === "Administrator");

    if (isAdminLogin) {
      // Validate Admin Security Password strictly against environment configuration
      if (password !== adminEnvPassword) {
        logSecurityEvent("ADMIN_LOGIN_FAILED", { email: inputEmail });
        return NextResponse.json({ error: "Invalid administrative security credentials." }, { status: 401 });
      }

      let adminUser = existingUser;

      // Auto-provision configured environment admin if missing in database
      if (!adminUser && inputEmail === adminEnvEmail) {
        try {
          adminUser = await User.create({
            name: adminEnvName,
            email: adminEnvEmail,
            role: "Administrator",
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            active: true
          });
        } catch (e) {
          console.warn("Failed to persist admin to MongoDB during login:", e.message);
        }
      }

      if (adminUser && adminUser.active === false) {
        logSecurityEvent("ADMIN_LOGIN_DISABLED_PROFILE", { email: inputEmail });
        return NextResponse.json({ error: "Access denied. This administrative profile has been disabled." }, { status: 403 });
      }

      const sessionUser = {
        name: adminUser?.name || adminEnvName,
        email: adminUser?.email || inputEmail,
        phone: "",
        avatar: "",
        joinDate: adminUser?.joinDate || "June 2026",
        role: "Administrator",
        isLoggedIn: true
      };

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

      logSecurityEvent("ADMIN_LOGIN_SUCCESS", { email: inputEmail });
      return NextResponse.json({ success: true, user: sessionUser });

    } else {
      // Customer Login
      let clientUser = existingUser;

      if (!clientUser) {
        // Auto-register new customer account
        const defaultName = inputEmail.split("@")[0].split(".").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "RAVTRON Client";
        try {
          clientUser = await User.create({
            name: defaultName,
            email: inputEmail,
            role: "Customer",
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            active: true
          });
        } catch (e) {
          console.warn("Failed to persist customer to MongoDB during login:", e.message);
        }
      }

      if (clientUser && clientUser.active === false) {
        logSecurityEvent("CUSTOMER_LOGIN_DISABLED_PROFILE", { email: inputEmail });
        return NextResponse.json({ error: "Access denied. Your profile has been deactivated. Please contact support." }, { status: 403 });
      }

      const defaultClientName = inputEmail.split("@")[0].split(".").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "RAVTRON Client";
      const sessionUser = {
        name: clientUser?.name || defaultClientName,
        email: clientUser?.email || inputEmail,
        phone: "",
        avatar: "",
        joinDate: clientUser?.joinDate || "June 2026",
        role: "Customer",
        isLoggedIn: true
      };

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
    }
  } catch (error) {
    logSecurityEvent("LOGIN_SERVER_ERROR", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
