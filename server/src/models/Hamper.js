import mongoose from "mongoose";

const hamperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true, // extra spaces avoid
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1, // zero qty prevent
        },
      },
    ],
    customNote: {
      type: String,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // negative price avoid
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Hamper = mongoose.model("Hamper", hamperSchema);
export default Hamper;
