import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    applicableCategory: { type: String, default: "All" },
    badgeType: { type: String, default: "Festive Offer" },
    expiryDate: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

if (mongoose.models.Coupon) {
  delete mongoose.models.Coupon;
}

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
