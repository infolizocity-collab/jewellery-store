// import { Order } from "../models/Order.js";
import Order from "../models/Order.js";

import { User } from "../models/User.js";
import Product from "../models/Product.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};
