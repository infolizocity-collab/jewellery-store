import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(","), // multiple origins allowed
    credentials: true,
  })
);

// ✅ Connect MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // abhi plain text, baad me bcrypt add karenge
});

const User = mongoose.model("User", userSchema);

// ✅ Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error: " + err.message });
  }
});

// ✅ Login Route with JWT
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Backend running with MongoDB Atlas & JWT");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
