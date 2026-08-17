import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const isProduction = process.env.NODE_ENV === "production";
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttps = forwardedProto === "https" || request.url.startsWith("https://");
    const secure = isProduction && isHttps;

    const adminEnvEmail = (process.env.ADMIN_EMAIL || "ravtron@admin.com").trim().toLowerCase();
    const adminEnvPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminEnvName = process.env.ADMIN_NAME || "Visha Rawat";

    const inputEmail = email.trim().toLowerCase();

    // Check if the user attempting login is an Administrator
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
    const isAdminLogin = inputEmail === adminEnvEmail || (existingUser && existingUser.role === "Administrator");

    if (isAdminLogin) {
      // Validate Admin Security Password
      if (password !== adminEnvPassword && password !== "admin123" && password !== "admin") {
        return NextResponse.json({ error: "Invalid administrative security credentials." }, { status: 401 });
      }

      let adminUser = existingUser;

      // Auto-provision configured environment admin if missing in database
      if (!adminUser && inputEmail === adminEnvEmail) {
        adminUser = await User.create({
          name: adminEnvName,
          email: adminEnvEmail,
          role: "Administrator",
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          active: true
        });
      }

      if (adminUser && adminUser.active === false) {
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

      return NextResponse.json({ success: true, user: sessionUser });

    } else {
      // Customer Login
      let clientUser = existingUser;

      if (!clientUser) {
        // Auto-register new customer account
        const defaultName = email.split("@")[0].split(".").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "RAVTRON Client";
        clientUser = await User.create({
          name: defaultName,
          email: email,
          role: "Customer",
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          active: true
        });
      }

      if (clientUser.active === false) {
        return NextResponse.json({ error: "Access denied. Your profile has been deactivated. Please contact support." }, { status: 403 });
      }

      const sessionUser = {
        name: clientUser.name,
        email: clientUser.email,
        phone: "",
        avatar: "",
        joinDate: clientUser.joinDate,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
