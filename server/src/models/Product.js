import mongoose from "mongoose";

// ✅ Review Schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    onSale: { type: Boolean, default: false },
    category: { type: String },
    stock: { type: Number, default: 0 },

    // Single main image
    image: { type: String },

    // Multiple images (gallery)
    images: [{ type: String }],

    slug: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },

    // Reviews array
    reviews: [reviewSchema],

    // Avg rating + total reviews
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Auto calculate rating & numReviews before save
productSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((acc, review) => acc + review.rating, 0) /
      this.reviews.length;
  } else {
    this.numReviews = 0;
    this.rating = 0;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
