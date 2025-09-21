import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

// 🔹 Order type
interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  items: {
    product: { name: string; price: number; img?: string };
    qty: number;
  }[];
}

// 🔹 Hamper type
interface Hamper {
  _id: string;
  title: string;
  items: {
    product: { name: string; price: number; img?: string };
    quantity: number;
  }[];
  customNote?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hampers, setHampers] = useState<Hamper[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ✅ Fetch normal orders
  const fetchOrders = async () => {
    try {
      const res = await api.get<Order[]>("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    }
  };

  // ✅ Fetch hamper orders
  const fetchHampers = async () => {
    try {
      const res = await api.get<Hamper[]>("/orders/hamper", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHampers(res.data);
    } catch (err) {
      console.error("❌ Error fetching hampers:", err);
    }
  };

  // ✅ Update normal order status
  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("❌ Error updating order:", err);
    }
  };

  // ✅ Update hamper order status
  const updateHamperStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/hamper/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHampers();
    } catch (err) {
      console.error("❌ Error updating hamper:", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchOrders(), fetchHampers()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Orders</h1>

      {/* Normal Orders */}
      <h2 className="text-2xl font-semibold mb-3">Normal Orders</h2>
      {orders.length === 0 ? (
        <p>No normal orders found</p>
      ) : (
        <div className="space-y-4 mb-10">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Order ID: {order._id}</span>
                <span className="text-sm">{order.status}</span>
              </div>
              <p>User: {order.user.name} ({order.user.email})</p>
              <p>Total: ₹{order.total}</p>

              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.product.name} (x{item.qty})</span>
                  <span>₹{item.product.price * item.qty}</span>
                </div>
              ))}

              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border px-2 py-1 mt-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Hamper Orders */}
      <h2 className="text-2xl font-semibold mb-3">Hamper Orders</h2>
      {hampers.length === 0 ? (
        <p>No hamper orders found</p>
      ) : (
        <div className="space-y-4">
          {hampers.map((hamper) => (
            <div key={hamper._id} className="border rounded-lg p-4 shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{hamper.title}</span>
                <span className="text-sm">{hamper.status}</span>
              </div>
              <p>User: {hamper.user.name} ({hamper.user.email})</p>
              <p>Total: ₹{hamper.totalPrice}</p>
              {hamper.customNote && <p>Note: {hamper.customNote}</p>}

              {hamper.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}

              <select
                value={hamper.status}
                onChange={(e) => updateHamperStatus(hamper._id, e.target.value)}
                className="border px-2 py-1 mt-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;