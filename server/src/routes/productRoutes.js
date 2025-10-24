import express from "express";
import Product from "../models/Product.js";
import {
  createProduct,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  addProductReview,
} from "../controllers/productController.js";
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
    const products = await Product.find({
      category: { $regex: new RegExp(category, "i") },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ All products (list / create) + search/filter/sort + pagination
router
  .route("/")
  .get(async (req, res) => {
    try {
      const {
        search,
        category,
        min,
        max,
        sort,
        tag,
        featured,
        page = 1,
        limit = 12,
      } = req.query;

      const query = {};
      if (search) query.name = { $regex: search, $options: "i" };
      if (category) query.category = { $regex: category, $options: "i" };
      if (tag) query.tags = tag;
      if (featured === "true") query.featured = true;
      if (min || max) query.price = {};
      if (min) query.price.$gte = Number(min);
      if (max) query.price.$lte = Number(max);

      let mongoQuery = Product.find(query);

      // 🔀 Sorting
      if (sort === "price_asc") mongoQuery = mongoQuery.sort({ price: 1 });
      if (sort === "price_desc") mongoQuery = mongoQuery.sort({ price: -1 });
      if (sort === "newest") mongoQuery = mongoQuery.sort({ createdAt: -1 });

      // 📄 Pagination
      const pageNum = Number(page) || 1;
      const pageLimit = Number(limit) || 12;
      const skip = (pageNum - 1) * pageLimit;

      const totalProducts = await Product.countDocuments(query);
      const products = await mongoQuery.skip(skip).limit(pageLimit);

      res.json({
        products,
        totalProducts,
        page: pageNum,
        totalPages: Math.ceil(totalProducts / pageLimit),
      });
    } catch (err) {
      console.error("Product search error:", err);
      res.status(500).json({ message: err.message });
    }
  })
  .post(protect, adminOnly, createProduct);

// ✅ Single product (get / update / delete)
router
  .route("/:id")
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

// ⭐ Add Review
router.post("/:id/reviews", protect, addProductReview);

export default router;
