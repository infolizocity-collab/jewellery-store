import { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../context/CartContext";

interface OrderResponse {
  _id: string;
}

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "Cash on Delivery",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; pincode?: string }>({});

  // ✅ Input Change with Live Validation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value))
        setErrors((prev) => ({ ...prev, phone: "Only digits allowed" }));
      else if (value.length !== 10 && value.length !== 0)
        setErrors((prev) => ({ ...prev, phone: "Phone must be 10 digits" }));
      else setErrors((prev) => ({ ...prev, phone: undefined }));
    }

    if (name === "pincode") {
      if (!/^\d{0,6}$/.test(value))
        setErrors((prev) => ({ ...prev, pincode: "Only digits allowed" }));
      else if (value.length !== 6 && value.length !== 0)
        setErrors((prev) => ({ ...prev, pincode: "Pincode must be 6 digits" }));
      else setErrors((prev) => ({ ...prev, pincode: undefined }));
    }
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");

    if (errors.phone || errors.pincode || form.phone.length !== 10 || form.pincode.length !== 6) {
      alert("Please provide valid Phone (10 digits) and Pincode (6 digits).");
      return;
    }

    try {
      setLoading(true);
      const items = cart.map((item: CartItem) => ({
        product: item._id,
        qty: item.quantity,
        price: item.price,
      }));

      const orderData = {
        items,
        address: form,
        paymentId: null,
        payment: form.payment,
      };

      const res = await api.post<OrderResponse>("/orders", orderData);
      clearCart();
      navigate(`/orders/${res.data._id}`);
    } catch (err: any) {
      console.error("❌ Error placing order:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to place order. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Checkout</h1>

      {/* Cart Summary */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        {cart.map((item: CartItem) => (
          <div key={item._id} className="flex justify-between border-b py-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-3">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Shipping Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-semibold mb-3">Shipping Details</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number (10 digits)"
            value={form.phone}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded ${
              errors.phone ? "border-red-500" : ""
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <input
          type="text"
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
        </div>

        <div>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode (6 digits)"
            value={form.pincode}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded ${
              errors.pincode ? "border-red-500" : ""
            }`}
          />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
        </div>

        {/* Payment */}
        <div>
          <label className="block mb-1 font-semibold">Payment Method</label>
          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Cash on Delivery">Cash on Delivery (COD)</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg font-semibold flex justify-center items-center disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          ) : null}
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
