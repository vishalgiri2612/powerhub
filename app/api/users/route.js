import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAdmin, verifyUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
    await dbConnect();
    const users = await User.find({}).sort({ name: 1 });
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

    if (!(await verifyUser(email))) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    if ((role !== undefined || active !== undefined) && !(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized: Administrator privileges required to change role or active status" }, { status: 403 });
    }

    await dbConnect();
    const updateFields = {};
    if (role !== undefined) updateFields.role = role;
    if (name !== undefined) updateFields.name = name;
    if (active !== undefined) updateFields.active = active;

    const updatedUser = await User.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email.trim()}$`, "i") } },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update session cookie if the user is updating their own profile
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ravtron_session")?.value;
    if (sessionCookie) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie));
        if (session.email.toLowerCase() === email.toLowerCase()) {
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
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 86400,
            sameSite: "lax"
          });
        }
      } catch (e) {
        console.error("Failed to update session cookie in PUT /api/users", e);
      }
    }

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

    const existing = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
    const userToSession = existing || await User.create({
      name,
      email,
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

    return NextResponse.json(userToSession, { status: existing ? 200 : 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
