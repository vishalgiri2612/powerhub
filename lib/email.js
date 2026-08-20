import nodemailer from "nodemailer";

// Helper to create transport from environment variables
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "officerequirementsgurgaon@gmail.com";
  const pass = process.env.SMTP_PASS;

  if (!host || !pass) {
    return null; // Return null if SMTP credentials are not configured yet
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

// Generic mail sender wrapper with fallback logging
export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || `RAVTRON® <${process.env.NEXT_PUBLIC_ADMIN_EMAIL || "officerequirementsgurgaon@gmail.com"}>`;

  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.log(`[EMAIL NOTICE] SMTP not configured in .env.local. Email preview for "${to}":\nSubject: ${subject}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log(`[EMAIL SENT] MessageId: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[EMAIL ERROR] Failed to send email via SMTP:", error);
    return { success: false, error: error.message };
  }
}

// 1. Send Customer Order Confirmation & Receipt Email
export async function sendOrderConfirmationEmail(order) {
  const recipient = order.customerEmail;
  if (!recipient) return;

  const itemsHtml = Array.isArray(order.items)
    ? order.items
        .map(
          (item) => `
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #1E293B; font-weight: 600;">
              ${item.name} ${item.selectedSize ? `<span style="color: #64748B; font-size: 11px;">(${item.selectedSize})</span>` : ""}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #1E293B; text-align: center; font-weight: 600;">
              ${item.qty || 1}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #3674B5; text-align: right; font-weight: 800;">
              ₹${((item.price || 0) * (item.qty || 1)).toLocaleString()}
            </td>
          </tr>`
        )
        .join("")
    : "";

  const shippingAddr = typeof order.shippingAddress === "object" && order.shippingAddress !== null
    ? `${order.shippingAddress.street || ""}, ${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} - ${order.shippingAddress.zip || ""}`
    : String(order.shippingAddress || "N/A");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - RAVTRON®</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              
              <!-- Header Banner -->
              <tr>
                <td style="background-color: #3674B5; padding: 32px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px;">RAVTRON®</h1>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Order Confirmation & Official Receipt</p>
                </td>
              </tr>

              <!-- Greeting & Status -->
              <tr>
                <td style="padding: 32px 40px 20px 40px;">
                  <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1E293B; font-weight: 800;">Thank You for Your Order, ${order.customerName || "Valued Customer"}!</h2>
                  <p style="margin: 0; font-size: 14px; color: #64748B; line-height: 1.6;">
                    We have successfully received your order <strong style="color: #3674B5;">#${order.id}</strong>. Our fulfillment center in Gurugram is preparing your items for express shipment.
                  </p>
                </td>
              </tr>

              <!-- Order Info Card -->
              <tr>
                <td style="padding: 0 40px 24px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="16" style="background-color: #F1F5F9; border-radius: 12px;">
                    <tr>
                      <td>
                        <div style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 800; letter-spacing: 1px;">Order Reference</div>
                        <div style="font-size: 15px; font-weight: 800; color: #1E293B; margin-top: 2px;">#${order.id}</div>
                      </td>
                      <td>
                        <div style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 800; letter-spacing: 1px;">Order Date</div>
                        <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-top: 2px;">${order.date || new Date().toLocaleDateString()}</div>
                      </td>
                      <td>
                        <div style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 800; letter-spacing: 1px;">Payment Method</div>
                        <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-top: 2px;">${order.paymentMethod || "Prepaid"}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 0 40px 24px 40px;">
                  <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #1E293B; font-weight: 800; letter-spacing: 1px;">Items Summary</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #F8F9FA;">
                        <th style="padding: 10px 16px; border-bottom: 2px solid #E2E8F0; text-align: left; font-size: 11px; color: #64748B; font-weight: 800; text-transform: uppercase;">Product Description</th>
                        <th style="padding: 10px 16px; border-bottom: 2px solid #E2E8F0; text-align: center; font-size: 11px; color: #64748B; font-weight: 800; text-transform: uppercase;">Qty</th>
                        <th style="padding: 10px 16px; border-bottom: 2px solid #E2E8F0; text-align: right; font-size: 11px; color: #64748B; font-weight: 800; text-transform: uppercase;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Price Breakdown & Address -->
              <tr>
                <td style="padding: 0 40px 32px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="55%" valign="top" style="padding-right: 20px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748B; font-weight: 800; letter-spacing: 1px;">Delivery Address</h4>
                        <p style="margin: 0; font-size: 13px; color: #1E293B; font-weight: 600; line-height: 1.5;">
                          <strong>${order.customerName || "Customer"}</strong><br>
                          ${shippingAddr}<br>
                          Phone: ${order.customerPhone || "N/A"}
                        </p>
                      </td>
                      <td width="45%" valign="top">
                        <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #1E293B;">
                          <tr>
                            <td style="color: #64748B; font-weight: 600;">Grand Total Paid:</td>
                            <td style="text-align: right; font-weight: 900; font-size: 18px; color: #3674B5;">₹${(order.total || 0).toLocaleString()}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #1E293B; padding: 24px 40px; text-align: center; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
                  <p style="margin: 0; font-size: 12px; color: #94A3B8; font-weight: 600;">
                    Need help with your order? Reach us at <a href="mailto:officerequirementsgurgaon@gmail.com" style="color: #3674B5; text-decoration: none; font-weight: 800;">officerequirementsgurgaon@gmail.com</a>
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748B;">
                    © ${new Date().getFullYear()} RAVTRON® by KSG Automation Pvt Ltd. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to: recipient,
    subject: `⚡ Order Confirmed: #${order.id} — RAVTRON®`,
    html,
    text: `Thank you for your order #${order.id}! Total paid: ₹${order.total}. We are preparing your order for shipment.`
  });
}

// 2. Send New Order Alert Email to Admin
export async function sendNewOrderAdminAlert(order) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "officerequirementsgurgaon@gmail.com";

  const shippingAddr = typeof order.shippingAddress === "object" && order.shippingAddress !== null
    ? `${order.shippingAddress.street || ""}, ${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} - ${order.shippingAddress.zip || ""}`
    : String(order.shippingAddress || "N/A");

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #F8F9FA; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; padding: 30px; border-radius: 16px; border: 1px solid #E2E8F0;">
        <h2 style="color: #3674B5; margin-top: 0;">🔔 New Order Received: #${order.id}</h2>
        <p style="font-size: 14px; color: #1E293B;">A new purchase has been placed on RAVTRON® website.</p>

        <table width="100%" cellpadding="8" style="font-size: 13px; background: #F1F5F9; border-radius: 8px; margin: 16px 0;">
          <tr><td><strong>Order ID:</strong></td><td>#${order.id}</td></tr>
          <tr><td><strong>Customer Name:</strong></td><td>${order.customerName || "Customer"}</td></tr>
          <tr><td><strong>Customer Email:</strong></td><td>${order.customerEmail}</td></tr>
          <tr><td><strong>Customer Phone:</strong></td><td>${order.customerPhone || "N/A"}</td></tr>
          <tr><td><strong>Total Amount:</strong></td><td style="color: #3674B5; font-weight: bold;">₹${(order.total || 0).toLocaleString()}</td></tr>
          <tr><td><strong>Shipping Address:</strong></td><td>${shippingAddr}</td></tr>
        </table>

        <p style="font-size: 12px; color: #64748B;">Log into the RAVTRON Admin Console to process and dispatch this shipment.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🔔 New Order Received: #${order.id} (₹${order.total})`,
    html,
    text: `New order #${order.id} received from ${order.customerName} (${order.customerEmail}) for ₹${order.total}.`
  });
}

// 3. Send Return Request Status Email (Approved / Declined)
export async function sendReturnStatusEmail(order, returnStatus, note = "") {
  const recipient = order.customerEmail;
  if (!recipient) return;

  const isApproved = returnStatus.toLowerCase() === "approved";
  const statusColor = isApproved ? "#10B981" : "#EF4444";

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #F8F9FA; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; padding: 30px; border-radius: 16px; border: 1px solid #E2E8F0;">
        <h2 style="color: ${statusColor}; margin-top: 0;">
          Return Request ${isApproved ? "Approved ✅" : "Declined ❌"}
        </h2>
        <p style="font-size: 14px; color: #1E293B;">
          Dear ${order.customerName || "Customer"}, your 7-day return request for Order <strong>#${order.id}</strong> has been updated.
        </p>

        <div style="padding: 16px; background: #F8F9FA; border-left: 4px solid ${statusColor}; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #1E293B;">Status: ${returnStatus.toUpperCase()}</h4>
          ${note ? `<p style="margin: 0; font-size: 13px; color: #475569;"><strong>Notes from Admin:</strong> ${note}</p>` : ""}
        </div>

        ${
          isApproved
            ? `<p style="font-size: 13px; color: #1E293B; line-height: 1.6;">
                Our courier logistics partner will pick up the package from your delivery address within 24–48 hours. Please ensure the product is packed in its original box with all accessories included. Refund will be credited within 5–7 business days after pickup inspection.
              </p>`
            : `<p style="font-size: 13px; color: #1E293B; line-height: 1.6;">
                If you believe this decision is an error, please reply directly to this email or reach out to customer support.
              </p>`
        }

        <p style="font-size: 12px; color: #94A3B8; margin-top: 24px;">© ${new Date().getFullYear()} RAVTRON® Customer Support</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: recipient,
    subject: `RAVTRON® Return Request ${returnStatus}: Order #${order.id}`,
    html,
    text: `Your return request for Order #${order.id} has been ${returnStatus}.`
  });
}
