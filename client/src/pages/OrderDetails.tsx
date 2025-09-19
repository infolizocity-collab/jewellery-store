// src/pages/OrderDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axiosInstance";

interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    product: { name: string; price: number; image?: string };
    qty: number;
  }[];
  address?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment?: string;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching order details:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading order details...</p>;

  if (!order)
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <Link to="/my-orders" className="text-yellow-500 underline">
          Back to My Orders
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>

      {/* Order Info */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
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
      </div>

      {/* Items */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center border-b py-2">
            <div className="flex items-center gap-3">
              {item.product?.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <span>{item.product?.name} (x{item.qty})</span>
            </div>
            <span>₹{item.product?.price * item.qty}</span>
          </div>
        ))}
        <div className="mt-3 font-bold text-right">Total: ₹{order.total}</div>
      </div>

      {/* Shipping Address */}
      {order.address ? (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
          <p>{order.address?.name}</p>
          <p>{order.address?.phone}</p>
          <p>{order.address?.address}</p>
          <p>
            {order.address?.city}, {order.address?.state} - {order.address?.pincode}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 mb-6 text-gray-600">
          <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
          <p>Not provided</p>
        </div>
      )}

      {/* Payment */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Payment</h2>
        <p>Method: {order.payment || "Cash on Delivery"}</p>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/my-orders"
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg font-medium"
        >
          Back to My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;
