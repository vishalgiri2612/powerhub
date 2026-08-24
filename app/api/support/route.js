import { NextResponse } from "next/server";
import { sendSupportTicketEmail, sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, subject, message, category } = await request.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ error: "Email, subject, and message are required." }, { status: 400 });
    }

    const ticketResult = await sendSupportTicketEmail({ name, email, subject, message, category });

    // Send Admin Notification Alert for Support Ticket
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "officerequirementsgurgaon@gmail.com";
    sendEmail({
      to: adminEmail,
      subject: `📩 New Support Ticket: ${subject} (${email})`,
      text: `Support ticket received from ${name} (${email}). Category: ${category}. Subject: ${subject}. Message: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px;">
          <h3 style="color: #3674B5;">📩 New Support Ticket Inquiry</h3>
          <p><strong>Customer Name:</strong> ${name || "N/A"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Category:</strong> ${category || "General Query"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #F1F5F9; padding: 12px; border-left: 4px solid #3674B5; margin: 0;">
            ${message}
          </blockquote>
        </div>
      `
    }).catch((err) => console.error("Admin support ticket email alert error:", err));

    return NextResponse.json({ success: true, message: "Support ticket registered successfully.", result: ticketResult });
  } catch (error) {
    console.error("POST /api/support error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
