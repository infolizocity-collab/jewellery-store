import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  createCustomHamper,
  getMyHampers,
  getAllHampers,
  updateHamperStatus,
} from "../controllers/hamperController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();


// ✅ Custom Hamper routes - id ke upar
router.post("/custom", protect, createCustomHamper);
router.get("/hamper/my", protect, getMyHampers);
router.get("/hamper", protect, adminOnly, getAllHampers);
router.put("/hamper/:id", protect, adminOnly, updateHamperStatus);

// ✅ Orders
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);

// ✅ Order detail (always last)
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, adminOnly, updateOrderStatus);

export default router;
