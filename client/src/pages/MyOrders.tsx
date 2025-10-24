import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { Link } from "react-router-dom";

interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  payment: string;
  items: {
    product: {
      name?: string;
      price?: number;
      image?: string;
    } | null;
    qty: number;
  }[];
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get<Order[]>("/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading your orders...</p>;

  // ✅ Empty State (only here)
  if (orders.length === 0)
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">No Orders Found</h2>
        <p className="text-gray-600 mb-4">
          You haven't placed any orders yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-yellow-400 hover:bg-yellow-500
                     px-5 py-2 rounded text-sm font-medium"
        >
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Order ID: {order._id}</span>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm">
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm">
              Payment: <span className="font-medium">{order.payment}</span>
            </p>

            <div className="mt-3 space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product?.name || "No name"}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                    <span>
                      {item.product?.name || "Product removed"} (x{item.qty})
                    </span>
                  </div>
                  <span className="font-medium">
                    ₹{(item.product?.price || 0) * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="font-bold">Total: ₹{order.total}</div>
              <Link
                to={`/orders/${order._id}`}
                className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 rounded text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
