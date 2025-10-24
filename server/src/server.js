import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ Load environment variables at the very top
dotenv.config();

const app = express();

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ✅ Middleware
app.use(express.json());

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ CORS setup: localhost + all Vercel deployments
const localOrigin = "http://localhost:5173";
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman or server-to-server requests
      if (origin === localOrigin) return callback(null, true);
      if (/\.vercel\.app$/.test(origin)) return callback(null, true); // allow all Vercel URLs
      return callback(new Error("❌ Not allowed by CORS: " + origin), false);
    },
    credentials: true,
  })
);

// ✅ Route Mounting
console.log("✅ Mounting routes...");
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("🚀 Backend running with MongoDB Atlas & JWT Auth");
});

// ✅ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ MongoDB Connection + Start Server
const PORT = process.env.PORT || 5000;

// Debugging: make sure MONGO_URI is loaded
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
