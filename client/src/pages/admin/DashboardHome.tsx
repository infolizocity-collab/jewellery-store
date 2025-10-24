import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SalesRevenueChart from "../../components/admin/SalesRevenueChart";
import api from "../../utils/axiosInstance";
import dayjs from "dayjs";
import { ShoppingCart, DollarSign, Users, Package } from "lucide-react";

// ✅ Types
interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  user?: { name?: string; email?: string };
}

interface AdminStats {
  totalSales: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
}

interface ChartDataPoint {
  date: string;
  sales: number;
  revenue: number;
}

const formatNumber = (value: number | undefined | null): string =>
  typeof value === "number" ? value.toLocaleString() : "0";

const StatsCard = ({
  icon,
  label,
  value,
  prefix = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  prefix?: string;
}) => (
  <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
    {icon}
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-2xl font-bold">
        {prefix}
        {formatNumber(value)}
      </h2>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const base = "px-2 py-1 rounded text-xs font-semibold";
  const styles =
    status === "delivered"
      ? "bg-green-100 text-green-700"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : status === "shipped"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  return <span className={`${base} ${styles}`}>{status}</span>;
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<AdminStats>("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("❌ Error fetching stats:", error);
      }
    };

    const fetchChartData = async () => {
      try {
        const res = await api.get<ChartDataPoint[]>("/admin/sales-history");
        if (Array.isArray(res.data)) {
          const formatted = res.data.map((item) => ({
            ...item,
            date: dayjs(item.date).format("MMM D"),
          }));
          setChartData(formatted);
        } else {
          console.warn("⚠️ Unexpected chart data format:", res.data);
        }
      } catch (error) {
        console.error("❌ Error fetching chart data:", error);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const res = await api.get<Order[]>("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) {
          setRecentOrders(res.data.slice(0, 5));
        } else {
          console.warn("⚠️ Unexpected orders format:", res.data);
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    };

    fetchStats();
    fetchChartData();
    fetchRecentOrders();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">📊 Dashboard Overview</h2>
      <p className="mb-6 text-gray-700">
        Welcome to the QUEENS ERA JEWELS Admin Panel. Use the sidebar to manage products, orders, and users.
      </p>

      {/* 🔹 Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Product
        </button>
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📦 View Orders
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          👥 Manage Users
        </button>
      </div>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard icon={<ShoppingCart className="text-blue-500" size={32} />} label="Total Sales" value={stats.totalSales} />
        <StatsCard icon={<DollarSign className="text-green-500" size={32} />} label="Total Revenue" value={stats.totalRevenue} prefix="₹" />
        <StatsCard icon={<Users className="text-purple-500" size={32} />} label="Total Users" value={stats.totalUsers} />
        <StatsCard icon={<Package className="text-orange-500" size={32} />} label="Total Products" value={stats.totalProducts} />
      </div>

      {/* 🔹 Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <SalesRevenueChart data={chartData} />
        </div>
      )}

      {/* 🔹 Recent Orders Preview */}
      <h3 className="text-lg font-semibold mb-3">🧾 Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total (₹)</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Placed</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.user?.name ?? "N/A"}</td>
                <td className="px-4 py-2">₹{order.total.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-2">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right mt-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            View All Orders →
          </button>
        </div>
      </div>
    </div>
  );
}