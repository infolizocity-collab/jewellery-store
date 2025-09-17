import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔑 Generate JWT Token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ✅ Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // create user
    const user = await User.create({ name, email, password });

    const token = generateToken({ id: user._id, role: user.isAdmin ? "admin" : "user" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "admin" : "user", // 👈 FIXED
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const user = await User.create({ name, email, password, isAdmin: true });

    const token = generateToken({ id: user._id, role: "admin" });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "admin", // 👈 FIXED
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // user fetch with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const role = user.isAdmin ? "admin" : "user";
    const token = generateToken({ id: user._id, role });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role, // 👈 FIXED
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Current User (Profile)
export const me = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
