import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAdmin, verifyUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { getCachedUsers, setCachedUsers, clearUsersCache } from "@/lib/cache";
import { escapeRegex, sanitizeEmail, logSecurityEvent } from "@/lib/security";

export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      logSecurityEvent("UNAUTHORIZED_GET_USERS_ATTEMPT");
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
    const cached = getCachedUsers();
    if (cached) {
      return NextResponse.json(cached);
    }
    await dbConnect();
    const users = await User.find({}).sort({ name: 1 }).lean();
    setCachedUsers(users);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, role, name, active } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = sanitizeEmail(email);

    if (!(await verifyUser(cleanEmail))) {
      logSecurityEvent("UNAUTHORIZED_PUT_USER_ATTEMPT", { targetEmail: cleanEmail });
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    if ((role !== undefined || active !== undefined) && !(await verifyAdmin())) {
      logSecurityEvent("UNAUTHORIZED_ROLE_CHANGE_ATTEMPT", { targetEmail: cleanEmail });
      return NextResponse.json({ error: "Unauthorized: Administrator privileges required to change role or active status" }, { status: 403 });
    }

    await dbConnect();
    const updateFields = {};
    if (role !== undefined) updateFields.role = role;
    if (name !== undefined) updateFields.name = name;
    if (active !== undefined) updateFields.active = active;

    const safeRegex = new RegExp(`^${escapeRegex(cleanEmail)}$`, "i");

    const updatedUser = await User.findOneAndUpdate(
      { email: { $regex: safeRegex } },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isProduction = process.env.NODE_ENV === "production";
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttps = forwardedProto === "https" || request.url.startsWith("https://");
    const secure = isProduction && isHttps;

    // Update session cookie if the user is updating their own profile
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ravtron_session")?.value;
    if (sessionCookie) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie));
        if (session.email.toLowerCase() === cleanEmail) {
          const sessionUser = {
            name: updatedUser.name,
            email: updatedUser.email,
            phone: "",
            avatar: "",
            joinDate: updatedUser.joinDate,
            role: updatedUser.role,
            isLoggedIn: true
          };
          cookieStore.set({
            name: "ravtron_session",
            value: encodeURIComponent(JSON.stringify(sessionUser)),
            httpOnly: true,
            secure,
            path: "/",
            maxAge: 345600, // 4 days
            sameSite: "lax"
          });
        }
      } catch (e) {
        console.error("Failed to update session cookie in PUT /api/users", e);
      }
    }

    clearUsersCache();
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, role, joinDate } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const cleanEmail = sanitizeEmail(email);
    const safeRegex = new RegExp(`^${escapeRegex(cleanEmail)}$`, "i");

    const existing = await User.findOne({ email: { $regex: safeRegex } });
    const userToSession = existing || await User.create({
      name,
      email: cleanEmail,
      role: role || "Customer",
      joinDate: joinDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      active: true
    });

    const sessionUser = {
      name: userToSession.name,
      email: userToSession.email,
      phone: "",
      avatar: "",
      joinDate: userToSession.joinDate,
      role: userToSession.role,
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

    clearUsersCache();
    return NextResponse.json(userToSession, { status: existing ? 200 : 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
