import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import { verifyUser } from "@/lib/auth";
import { calculateVerifiedCouponDiscount } from "@/lib/couponSecurity";

// Initialise the Razorpay instance with server-side credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, deliveryPref, coupon, currency = "INR", customerEmail, notes } = body;

    // ── 1. Auth guard — only logged-in users can create a payment order ──────
    if (!customerEmail || !(await verifyUser(customerEmail))) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing user session" },
        { status: 403 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required to create a payment order" },
        { status: 400 }
      );
    }

    // ── 2. SECURITY: Recalculate amount server-side from DB prices ────────────
    // NEVER trust the amount sent from the frontend — always fetch from DB.
    await dbConnect();

    let subtotal = 0;

    for (const item of items) {
      if (!item.productId) {
        return NextResponse.json(
          { error: `Missing productId for cart item` },
          { status: 400 }
        );
      }

      const product = await Product.findOne({ id: item.productId });
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      // Respect size-based pricing if applicable
      let price = product.price;
      if (item.selectedSize && Array.isArray(product.sizePrices)) {
        const sizePriceObj = product.sizePrices.find(
          (sp) => sp.size === item.selectedSize
        );
        if (sizePriceObj) price = sizePriceObj.price;
      }

      const qty = Math.max(1, Number(item.qty || item.quantity || 1));
      subtotal += price * qty;
    }

    // Server-side coupon validation (100% secure)
    const validatedItemsForCoupon = items.map((item) => ({
      productId: item.productId,
      selectedSize: item.selectedSize || null,
      price: item.price || 0,
      qty: Math.max(1, Number(item.qty || item.quantity || 1))
    }));

    const { verifiedSavings } = await calculateVerifiedCouponDiscount({
      couponCodeInput: coupon,
      customerEmail,
      validatedItems: validatedItemsForCoupon,
      subtotal
    });

    // Recalculate delivery + GST server-side
    const deliveryCharge = deliveryPref === "express" ? 199 : subtotal > 999 ? 0 : 99;
    const taxableAmount = Math.max(0, subtotal - verifiedSavings);
    const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST
    const verifiedTotal = taxableAmount + deliveryCharge + taxAmount;

    if (verifiedTotal <= 0) {
      return NextResponse.json(
        { error: "Calculated order total is invalid" },
        { status: 400 }
      );
    }

    // ── 3. Create Razorpay order with server-verified amount ─────────────────
    // Razorpay accepts amount in the SMALLEST currency unit (paise for INR)
    const amountInPaise = Math.round(verifiedTotal * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      verifiedTotal, // Send back so frontend can display confirmed amount
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("[RAZORPAY] Create order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
