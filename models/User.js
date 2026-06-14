import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    joinDate: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
