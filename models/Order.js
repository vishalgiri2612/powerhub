import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  productId: { type: String },
  selectedSize: { type: String }
});

const TrackingStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
    statusColor: { type: String, required: true },
    total: { type: Number, required: true },
    savings: { type: Number, default: 0 },
    coupon: { type: String, default: "" },
    deliveryPref: { type: String, default: "standard" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    paymentMethod: { type: String, default: "CARD" },
    items: { type: [OrderItemSchema], default: [] },
    trackingSteps: { type: [TrackingStepSchema], default: [] }
  },
  { timestamps: true }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
