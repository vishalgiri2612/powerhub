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
    sizes: { type: [String], default: [] },
    privacySizes: { type: [String], default: [] },
    sizePrices: {
      type: [
        {
          size: { type: String, required: true },
          price: { type: Number, required: true },
          originalPrice: { type: Number, required: true }
        }
      ],
      default: []
    },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    color: { type: String, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String, default: "" },
    topSelling: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Force delete cached model to apply schema changes in Next.js development hot reload
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
