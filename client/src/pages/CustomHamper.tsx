import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

const CustomHamper = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Products load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Select/unselect products
  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || selectedItems.length === 0) {
      setMessage("⚠️ Please fill all fields and select at least 1 product.");
      return;
    }

    // ✅ Backend ko required format me items bhejna
    const formattedItems = selectedItems.map((id) => ({
      product: id,
      quantity: 1,
    }));

    const totalPrice = products
      .filter((p) => selectedItems.includes(p._id))
      .reduce((acc, p) => acc + p.price, 0);

    try {
      await api.post(
        "http://localhost:5000/api/orders/custom",
        {
          title: "Custom Hamper",
          items: formattedItems,
          customNote: `Created by ${name}, Contact: ${phone}`,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ token zaroori hai
          },
        }
      );

      setSuccess("🎉 Your custom hamper order has been placed!");
      setMessage("");
      setName("");
      setPhone("");
      setSelectedItems([]);
    } catch (err) {
      setMessage("❌ Error placing order. Please try again.");
      console.error("Hamper Order Error:", err);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-6 font-serif">
      <h2 className="text-3xl font-bold text-center mb-8">
        🎁 Create Your Own Hamper
      </h2>

      {/* ✅ Messages */}
      {message && <p className="text-center text-red-400 mb-4">{message}</p>}
      {success && <p className="text-center text-green-400 mb-4">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg"
      >
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-black border border-gray-700 w-full"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 rounded bg-black border border-gray-700 w-full"
          />
        </div>

        {/* Product Selection */}
        <h3 className="text-xl mb-4">✨ Select Jewelry for Your Hamper</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-h-[400px] overflow-y-auto p-2 border border-gray-700 rounded">
          {products.map((p) => (
            <div
              key={p._id}
              className={`cursor-pointer bg-gray-800 p-3 rounded-lg text-center hover:scale-105 transition ${
                selectedItems.includes(p._id) ? "border-2 border-yellow-500" : ""
              }`}
              onClick={() => toggleSelection(p._id)}
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-24 mx-auto mb-2 rounded"
              />
              <p className="text-sm">{p.name}</p>
              <p className="text-yellow-400 text-sm">₹{p.price}</p>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition"
          >
            Place Hamper Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomHamper;
