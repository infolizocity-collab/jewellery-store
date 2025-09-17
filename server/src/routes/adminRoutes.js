import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

import { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";

import { 
  getAllOrders,   // ✅ सही नाम import किया
  updateOrderStatus 
} from "../controllers/orderController.js";

import { getAdminStats } from "../controllers/adminController.js";

const router = express.Router();

// ✅ Dashboard Stats
router.get("/stats", protect, adminOnly, getAdminStats);

// ✅ Products
router.post("/products", protect, adminOnly, createProduct);
router.get("/products", protect, adminOnly, getProducts);
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

// ✅ Orders
router.get("/orders", protect, adminOnly, getAllOrders);   // ✅ fix
router.put("/orders/:id", protect, adminOnly, updateOrderStatus);

export default router;
