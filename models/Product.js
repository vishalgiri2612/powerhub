import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortSpec: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountBadge: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    color: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
