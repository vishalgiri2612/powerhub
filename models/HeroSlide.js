import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema(
  {
    slideIndex: { type: Number, required: true, unique: true },
    disconnected: { type: String, required: true },
    connected: { type: String, required: true },
    productId: { type: String, required: true }, // The product ID to redirect to
    tag1: { type: String, default: "" },
    tag1Desc: { type: String, default: "" },
    tag2: { type: String, default: "" },
    tag2Desc: { type: String, default: "" },
    tag3: { type: String, default: "" },
    tag3Desc: { type: String, default: "" }
  },
  { timestamps: true }
);

// Force delete cached model to apply schema changes in Next.js development hot reload
if (mongoose.models.HeroSlide) {
  delete mongoose.models.HeroSlide;
}

export default mongoose.models.HeroSlide || mongoose.model("HeroSlide", HeroSlideSchema);
