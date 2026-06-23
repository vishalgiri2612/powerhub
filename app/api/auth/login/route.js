import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password, loginMode } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (loginMode === "admin") {
      if (password !== "admin123" && password !== "admin") {
        return NextResponse.json({ error: "Invalid administrative security credentials." }, { status: 401 });
      }

      const adminUser = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
      if (!adminUser) {
        return NextResponse.json({ error: "Email is not registered as an Administrator in database." }, { status: 404 });
      }
      if (adminUser.role !== "Administrator") {
        return NextResponse.json({ error: "Access denied. User does not possess Administrator rights." }, { status: 403 });
      }
      if (adminUser.active === false) {
        return NextResponse.json({ error: "Access denied. This administrative profile has been disabled." }, { status: 403 });
      }

      const sessionUser = {
        name: adminUser.name,
        email: adminUser.email,
        phone: "",
        avatar: "",
        joinDate: adminUser.joinDate,
        role: "Administrator",
        isLoggedIn: true
      };

      const cookieStore = await cookies();
      cookieStore.set({
        name: "ravtron_session",
        value: encodeURIComponent(JSON.stringify(sessionUser)),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 86400, // 1 day
        sameSite: "lax"
      });

      return NextResponse.json({ success: true, user: sessionUser });

    } else {
      // Customer login
      const clientUser = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
      let finalUser = clientUser;

      if (!clientUser) {
        // Auto-register
        const defaultName = email.split("@")[0].split(".").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Ravtron Client";
        finalUser = await User.create({
          name: defaultName,
          email: email,
          role: "Customer",
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          active: true
        });
      }

      if (finalUser.role === "Administrator") {
        return NextResponse.json({ error: "Please use the Administrator tab to log in with an admin account." }, { status: 400 });
      }
      if (finalUser.active === false) {
        return NextResponse.json({ error: "Access denied. Your client profile has been deactivated. Please contact support." }, { status: 403 });
      }

      const sessionUser = {
        name: finalUser.name,
        email: finalUser.email,
        phone: "",
        avatar: "",
        joinDate: finalUser.joinDate,
        role: "Customer",
        isLoggedIn: true
      };

      const cookieStore = await cookies();
      cookieStore.set({
        name: "ravtron_session",
        value: encodeURIComponent(JSON.stringify(sessionUser)),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 86400,
        sameSite: "lax"
      });

      return NextResponse.json({ success: true, user: sessionUser });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
