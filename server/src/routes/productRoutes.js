import express from "express";
import Product from "../models/Product.js";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { addReview } from "../controllers/reviewController.js"; // ⭐ review controller import
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔥 GET sale products
router.get("/sale", async (req, res) => {
  try {
    const saleProducts = await Product.find({ onSale: true });
    res.json(saleProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get product by Slug
router.get("/slug/:slug", getProductBySlug);

// ✅ Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: { $regex: new RegExp(category, "i") } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ All products (list / create)
router
  .route("/")
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

// ✅ Single product (get / update / delete)
router
  .route("/:id")
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

// ⭐ Add Review (logged-in user only)
router.post("/:id/reviews", protect, addReview);

export default router;
