import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { escapeRegex, sanitizeEmail, hashPassword, logSecurityEvent, verifyBotProtection } from "@/lib/security";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { sendVerificationOTPEmail } from "@/lib/email";

// Strict RFC 5322 Compliant Email Regex: Requires valid name, @, domain, and TLD (e.g. .com)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = rateLimit(`send_otp_${clientIp}`, 3, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait 1 minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const botCheck = verifyBotProtection(body);
    if (botCheck.isBot) {
      return NextResponse.json({ error: "Invalid submission detected." }, { status: 400 });
    }

    const { name, email, password, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const cleanEmail = sanitizeEmail(email);

    // Strict Email Format Validation
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address (e.g., name@example.com)." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user is already registered
    const safeRegex = new RegExp(`^${escapeRegex(cleanEmail)}$`, "i");
    const existingUser = await User.findOne({ email: { $regex: safeRegex } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await hashPassword(password);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Overwrite any existing pending OTP for this email
    await OTP.deleteMany({ email: cleanEmail });
    await OTP.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      otp,
      expiresAt
    });

    // Send Verification Email
    const emailResult = await sendVerificationOTPEmail({
      email: cleanEmail,
      name: name.trim(),
      otp
    });

    logSecurityEvent("OTP_SENT", { email: cleanEmail, simulated: !!emailResult.simulated });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}.`
    });

  } catch (error) {
    logSecurityEvent("SEND_OTP_ERROR", { error: error.message });
    return NextResponse.json({ error: error.message || "Failed to send verification code." }, { status: 500 });
  }
}
