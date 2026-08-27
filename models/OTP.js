import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    name: { type: String, default: "" },
    password: { type: String, default: "" },
    phone: { type: String, default: "" },
    type: { type: String, default: "registration" },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-deletes document after 10 mins
  }
);

export default mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
