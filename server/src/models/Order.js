import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  
  payment: { type: String, default: "Cash on Delivery" }, // ✅ नया field
  paymentId: { type: String },
  address: { type: Object }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
