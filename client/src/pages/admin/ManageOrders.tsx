import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Types
interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}
interface Product {
  name?: string;
  price?: number;
  img?: string;
}
interface OrderItem {
  product?: Product;
  qty: number;
}
interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  payment?: string;
  address?: Address;
  user?: { name?: string; email?: string };
  items?: OrderItem[];
}
interface HamperItem {
  product?: Product;
  quantity: number;
}
interface Hamper {
  _id: string;
  title: string;
  items?: HamperItem[];
  customNote?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  user?: { name?: string; email?: string };
}

const StatusBadge = ({ status }: { status: string }) => {
  const base = "px-2 py-1 rounded text-xs font-semibold";
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    confirmed: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return <span className={`${base} ${colors[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
};

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hampers, setHampers] = useState<Hamper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | Hamper | null>(null);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await api.get<Order[]>("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    }
  };

  const fetchHampers = async () => {
    try {
      const res = await api.get<Hamper[]>("/orders/hamper", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHampers(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching hampers:", err);
    }
  };

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // 🧾 Invoice Generate Function
  const downloadInvoice = (order: Order | Hamper) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Queens Era Jewels - Invoice", 14, 15);

    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 14, 25);
    doc.text(`Date: ${formatDate(order.createdAt)}`, 14, 30);
    doc.text(`Customer: ${order.user?.name} (${order.user?.email})`, 14, 35);

    if ("address" in order && order.address) {
      const addr = order.address;
      doc.text(
        `Address: ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
        14,
        40
      );
    }

    autoTable(doc, {
      startY: 50,
      head: [["Item", "Qty", "Price", "Total"]],
      body: (("items" in order ? order.items : order.items) || []).map((item: any) => [
        item.product?.name ?? "Item",
        item.qty || item.quantity,
        `₹${item.product?.price ?? 0}`,
        `₹${(item.product?.price ?? 0) * (item.qty || item.quantity)}`,
      ]),
    });

    const totalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(
      `Total: ₹${"totalPrice" in order ? order.totalPrice : order.total}`,
      14,
      totalY
    );

    doc.save(`invoice_${order._id}.pdf`);
  };

  if (loading) return <p className="text-center mt-10 animate-pulse">Loading orders...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 Manage Orders</h1>

      {/* 🟢 Normal Orders */}
      <h2 className="text-2xl font-semibold mb-3">Normal Orders</h2>
      {orders.length === 0 ? (
        <p>No normal orders found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-lg transition space-y-3 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">Order ID: {order._id}</span>
                <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
              </div>
              <p><strong>User:</strong> {order.user?.name ?? "N/A"} ({order.user?.email ?? "N/A"})</p>
              <p><strong>Payment:</strong> {order.payment ?? "Cash on Delivery"}</p>
              {order.address && (
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              )}
              <p className="font-semibold">Total: ₹{order.total}</p>
              <StatusBadge status={order.status} />
            </div>
          ))}
        </div>
      )}

      {/* 🟠 Hamper Orders */}
      <h2 className="text-2xl font-semibold mb-3">Hamper Orders</h2>
      {hampers.length === 0 ? (
        <p>No hamper orders found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {hampers.map((hamper) => (
            <div
              key={hamper._id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-lg transition space-y-3 cursor-pointer"
              onClick={() => setSelectedOrder(hamper)}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{hamper.title}</span>
                <span className="text-sm text-gray-500">{formatDate(hamper.createdAt)}</span>
              </div>
              <p><strong>User:</strong> {hamper.user?.name ?? "N/A"} ({hamper.user?.email ?? "N/A"})</p>
              {hamper.customNote && <p><strong>Note:</strong> {hamper.customNote}</p>}
              <p className="font-semibold">Total: ₹{hamper.totalPrice}</p>
              <StatusBadge status={hamper.status} />
            </div>
          ))}
        </div>
      )}

      {/* 🔵 Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50">
          <div className="bg-white rounded-lg p-6 w-[650px] max-h-[85vh] overflow-y-auto relative">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>User:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
            <p><strong>Status:</strong> 
              <select
                value={selectedOrder.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  if ("totalPrice" in selectedOrder) {
                    await updateHamperStatus(selectedOrder._id, newStatus);
                  } else {
                    await updateStatus(selectedOrder._id, newStatus);
                  }
                  setSelectedOrder({ ...selectedOrder, status: newStatus });
                }}
                className="ml-2 border px-2 py-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </p>
            <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>

            {"address" in selectedOrder && selectedOrder.address && (
              <p>
                <strong>Address:</strong> {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
              </p>
            )}

            <div className="divide-y my-4">
              {(selectedOrder.items || []).map((item: any, idx: number) => {
                const qty = "qty" in item ? item.qty : item.quantity;
                const price = item.product?.price ?? 0;
                return (
                  <div key={idx} className="flex justify-between py-2">
                    <div className="flex gap-3 items-center">
                      {item.product?.img && <img src={item.product.img} alt={item.product?.name} className="w-12 h-12 object-cover rounded" />}
                      <span>{item.product?.name ?? "Item"} x{qty}</span>
                    </div>
                    <span>₹{price * qty}</span>
                  </div>
                );
              })}
            </div>

            <p className="font-semibold text-lg">
              Total: ₹{"totalPrice" in selectedOrder ? selectedOrder.totalPrice : selectedOrder.total}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => downloadInvoice(selectedOrder)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Download Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
