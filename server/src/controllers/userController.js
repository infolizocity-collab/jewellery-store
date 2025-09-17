import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.js";
import streamifier from "streamifier";  // 🔥 Add this (npm install streamifier)

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to stream
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics", resource_type: "image" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload(req.file.buffer);

    // Update user profile with Cloudinary URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (err) {
    console.error("🔥 Upload Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
