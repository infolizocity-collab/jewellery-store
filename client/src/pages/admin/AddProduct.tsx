import { useState } from "react";
import api from "@/utils/axiosInstance";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>(""); // ✅ blank
  const [originalPrice, setOriginalPrice] = useState<string>(""); // ✅ blank
  const [onSale, setOnSale] = useState(false);
  const [stock, setStock] = useState<string>(""); // ✅ blank
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // slug generate
      const slug = name.toLowerCase().replace(/\s+/g, "-");

      await api.post(
        "http://localhost:5000/api/products",
        {
          name,
          description,
          price: Number(price), // ✅ number convert
          originalPrice: Number(originalPrice),
          onSale,
          stock: Number(stock),
          category,
          image,
          slug,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Product added successfully");

      // reset form
      setName("");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setOnSale(false);
      setStock("");
      setImage("");
      setCategory("");
    } catch (err: any) {
      console.error(err);
      setError("❌ Error adding product. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Product</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2"
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Sale Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2"
          required
        />

        {/* Original Price */}
        <input
          type="number"
          placeholder="Original Price (₹)"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          className="border p-2"
        />

        {/* On Sale Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
          />
          On Sale?
        </label>

        {/* Stock */}
        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2"
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category (e.g. Necklace, Ring)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        />

        {/* Image URL */}
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-2"
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-20 h-20 object-cover rounded"
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
