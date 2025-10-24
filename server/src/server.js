import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ CORS setup
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS: " + origin));
      }
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
