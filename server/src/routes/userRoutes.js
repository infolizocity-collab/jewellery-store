import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadProfilePic } from "../controllers/userController.js";

const router = express.Router();

// ✅ memory storage (for cloudinary)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only images allowed"), false);
  } else {
    cb(null, true);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/users/profile-pic
router.post("/profile-pic", protect, upload.single("profilePic"), uploadProfilePic);

export default router;
