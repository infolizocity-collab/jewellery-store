import express from "express";
import { register, registerAdmin, login, me } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ User Registration
router.post("/register", register);

// ✅ Admin Registration (sirf testing ke liye, baad me hata bhi sakte ho)
router.post("/register-admin", registerAdmin);

// ✅ Login
router.post("/login", login);

// ✅ Get current user (Protected)
router.get("/me", protect, me);

export default router;
