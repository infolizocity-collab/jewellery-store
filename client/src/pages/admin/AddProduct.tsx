import { useState } from "react";
import api from "@/utils/axiosInstance";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [onSale, setOnSale] = useState(false);
  const [stock, setStock] = useState<string>("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  // ✅ Festive tags
  const [isNavratri, setIsNavratri] = useState(false);
  const [isDiwali, setIsDiwali] = useState(false);
  const [isDussehra, setIsDussehra] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false); // ✅ new state

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !price) {
      setError("Product name and price are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("⚠️ Admin login required");
        setLoading(false);
        return;
      }

      const slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      const tags = [];
      if (isNavratri) tags.push("navratri");
      if (isDiwali) tags.push("diwali");
      if (isDussehra) tags.push("dussehra");

      await api.post(
        "/products",
        {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          originalPrice: Number(originalPrice) || Number(price),
          onSale,
          stock: Number(stock) || 0,
          category: category.trim(),
          image: image.trim(),
          slug,
          tags,
          featured: isFeatured, // ✅ new field
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Product added successfully!");

      // reset form
      setName("");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setOnSale(false);
      setStock("");
      setImage("");
      setCategory("");
      setIsNavratri(false);
      setIsDiwali(false);
      setIsDussehra(false);
      setIsFeatured(false);
    } catch (err: any) {
      console.error("Add product error:", err);
      setError(
        err?.response?.data?.message || "❌ Error adding product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Product</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Product Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Sale Price (₹)*"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
          min="0"
        />

        <input
          type="number"
          placeholder="Original Price (₹)"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          className="border p-2 rounded"
          min="0"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
          />
          On Sale?
        </label>

        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2 rounded"
          min="0"
        />

        <input
          type="text"
          placeholder="Category (e.g. Necklace, Ring)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />

        {/* ✅ Festive Tags */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isNavratri}
              onChange={(e) => setIsNavratri(e.target.checked)}
            />
            Navratri Special
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDiwali}
              onChange={(e) => setIsDiwali(e.target.checked)}
            />
            Diwali Special
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDussehra}
              onChange={(e) => setIsDussehra(e.target.checked)}
            />
            Dussehra Special
          </label>
        </div>

        {/* ✅ Featured Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Show on Festive Page?
        </label>

        {/* ✅ Preview Festive Tags */}
        {(isNavratri || isDiwali || isDussehra) && (
          <div className="flex gap-2 mt-2">
            {isNavratri && (
              <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                🎉 Navratri
              </span>
            )}
            {isDiwali && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                🪔 Diwali
              </span>
            )}
            {isDussehra && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                🏹 Dussehra
              </span>
            )}
          </div>
        )}

        <input
          type="url"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-2 rounded"
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            onError={(e) => (e.currentTarget.src = "/assets/fallback.jpg")}
            className="w-24 h-24 object-cover rounded border"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}