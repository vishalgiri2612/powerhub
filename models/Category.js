import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    image: { type: String, default: "/images/charger.png" },
    showOnHome: { type: Boolean, default: false },
    homePosition: { type: Number, default: 0 },
    subcategories: { type: [String], default: [] }
  },
  { timestamps: true }
);

// Force delete cached model to apply schema changes in Next.js development hot reload
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
