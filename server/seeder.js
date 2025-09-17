import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import connectDB from "./src/config/db.js";

dotenv.config();
await connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (!adminExists) {
      const admin = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "123456",
        isAdmin: true,
      });

      await admin.save();
      console.log("✅ Admin User Created");
    } else {
      console.log("⚡ Admin already exists");
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
