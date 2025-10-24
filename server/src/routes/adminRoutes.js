import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getAdminStats,
  getSalesHistory,
} from "../controllers/adminController.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { User } from "../models/User.js";

const router = express.Router();

// 🔹 Admin Dashboard
router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/sales-history", protect, adminOnly, getSalesHistory);

// 🔹 Product Management
router.post("/products", protect, adminOnly, createProduct);
router.get("/products", protect, adminOnly, getProducts);
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

// 🔹 Order Management
router.get("/orders", protect, adminOnly, getAllOrders);
router.put("/orders/:id", protect, adminOnly, updateOrderStatus);

// 🔹 User Management
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = req.body.isAdmin ?? user.isAdmin;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
