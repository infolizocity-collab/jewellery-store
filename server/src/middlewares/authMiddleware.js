import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// 🔹 Protect Middleware (only logged-in users allowed)
export const protect = async (req, res, next) => {
  let token;

  try {
    // Check if Authorization header exists and starts with Bearer
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and exclude password
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "❌ User not found" });
      }

      req.user = user; // attach user to req
      return next();
    }

    return res.status(401).json({ message: "❌ Not authorized, no token" });
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "❌ Not authorized, token failed" });
  }
};

// 🔹 Admin Only Middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "⛔ Admin access only" });
};
