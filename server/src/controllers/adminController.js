import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { User } from "../models/User.js";

// 🔹 Overview Stats
export const getAdminStats = async (req, res) => {
  try {
    const sampleOrder = await Order.findOne();
    console.log("🧾 Sample Order:", {
      total: sampleOrder?.total,
      createdAt: sampleOrder?.createdAt,
    });

    const [totalUsers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    ]);

    console.log("🧑‍💼 Users:", totalUsers);
    console.log("💍 Products:", totalProducts);
    console.log("📦 Orders:", totalOrders);
    console.log("💰 Revenue Agg:", revenueAgg);

    res.json({
      totalUsers: totalUsers,
      totalProducts: totalProducts,
      totalSales: totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (error) {
    console.error("❌ Admin stats error:", error);
    res.status(500).json({
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

// 🔹 Chart Data for Sales & Revenue
export const getSalesHistory = async (req, res) => {
  try {
    const rawOrders = await Order.find().limit(3);
    console.log("📅 Raw Orders:", rawOrders.map(o => ({
      total: o.total,
      createdAt: o.createdAt,
    })));

    const history = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("📊 Sales History:", history);

    const formatted = history.map((entry) => ({
      date: entry._id,
      sales: entry.sales,
      revenue: entry.revenue,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("❌ Sales history error:", error);
    res.status(500).json({
      message: "Error fetching sales history",
      error: error.message,
    });
  }
};