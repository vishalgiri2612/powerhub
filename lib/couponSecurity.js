import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { escapeRegex } from "@/lib/security";

/**
 * Server-Side Secure Coupon Validator & Discount Calculator
 * OWASP Top 10 Compliant:
 *   - Prevents NoSQL Injection on coupon query
 *   - Prevents ReDoS / Regex injection on email lookup
 *   - Prevents Category & Product Scope Bypasses
 *   - Enforces per-user single-use restriction
 *   - Enforces percentage (0-100%) and fixed discount mathematical limits
 *
 * @param {Object} params
 * @param {string} params.couponCodeInput - Raw coupon code from request
 * @param {string} params.customerEmail - Customer email address
 * @param {Array} params.validatedItems - Array of DB-verified order items [{ productId, price, qty }]
 * @param {number} params.subtotal - Server-recalculated cart subtotal
 * @returns {Promise<{ verifiedSavings: number, couponCode: string }>}
 */
export async function calculateVerifiedCouponDiscount({
  couponCodeInput,
  customerEmail,
  validatedItems = [],
  subtotal = 0,
}) {
  // 1. Input Type Guard — NoSQL Injection Prevention
  if (!couponCodeInput || typeof couponCodeInput !== "string") {
    return { verifiedSavings: 0, couponCode: "" };
  }

  const cleanCode = couponCodeInput.trim().toUpperCase();
  if (!cleanCode) {
    return { verifiedSavings: 0, couponCode: "" };
  }

  await dbConnect();

  // 2. Fetch Coupon Document securely
  const couponDoc = await Coupon.findOne({ code: cleanCode, active: true }).lean();
  if (!couponDoc) {
    return { verifiedSavings: 0, couponCode: "" };
  }

  // 3. Minimum Purchase Validation
  if (couponDoc.minPurchase > 0 && subtotal < couponDoc.minPurchase) {
    return { verifiedSavings: 0, couponCode: "" };
  }

  // 4. Expiry Date Validation
  if (couponDoc.expiryDate) {
    const today = new Date();
    const expiry = new Date(couponDoc.expiryDate);
    expiry.setHours(23, 59, 59, 999);
    if (today > expiry) {
      return { verifiedSavings: 0, couponCode: "" };
    }
  }

  // 5. Per-User Single Use Validation
  if (
    couponDoc.oneTimePerUser !== false &&
    customerEmail &&
    typeof customerEmail === "string"
  ) {
    const cleanEmail = customerEmail.trim().toLowerCase();
    if (cleanEmail) {
      const existingOrder = await Order.findOne({
        customerEmail: new RegExp(`^${escapeRegex(cleanEmail)}$`, "i"),
        coupon: cleanCode,
        status: { $ne: "Cancelled" },
      }).lean();

      if (existingOrder) {
        return { verifiedSavings: 0, couponCode: "" };
      }
    }
  }

  // 6. Category / Product Scope Discount Calculation
  let applicableSubtotal = subtotal;

  if (couponDoc.applicableProductId) {
    // Product-specific coupon
    const targetItem = validatedItems.find(
      (item) => String(item.productId) === String(couponDoc.applicableProductId)
    );
    if (!targetItem) {
      return { verifiedSavings: 0, couponCode: "" }; // Target product not in cart
    }
    applicableSubtotal = (Number(targetItem.price) || 0) * (Number(targetItem.qty) || 1);
  } else if (
    couponDoc.applicableCategory &&
    couponDoc.applicableCategory !== "All"
  ) {
    // Category-specific coupon
    let categorySubtotal = 0;
    for (const item of validatedItems) {
      const product = await Product.findOne({ id: item.productId })
        .select("category")
        .lean();
      if (
        product &&
        product.category &&
        product.category.toLowerCase() === couponDoc.applicableCategory.toLowerCase()
      ) {
        categorySubtotal += (Number(item.price) || 0) * (Number(item.qty) || 1);
      }
    }
    if (categorySubtotal <= 0) {
      return { verifiedSavings: 0, couponCode: "" }; // No matching category items in cart
    }
    applicableSubtotal = categorySubtotal;
  }

  // 7. Calculate Discount Amount Safely
  let verifiedSavings = 0;

  if (couponDoc.type === "percentage") {
    // Clamp percentage between 0% and 100%
    const pct = Math.min(100, Math.max(0, Number(couponDoc.discountValue) || 0));
    verifiedSavings = Math.round((applicableSubtotal * pct) / 100);
  } else {
    // Fixed amount discount
    const fixedVal = Math.max(0, Number(couponDoc.discountValue) || 0);
    verifiedSavings = Math.min(fixedVal, applicableSubtotal);
  }

  // Savings cannot exceed overall cart subtotal
  verifiedSavings = Math.min(verifiedSavings, subtotal);

  return { verifiedSavings, couponCode: cleanCode };
}
