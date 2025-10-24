import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

// 🔹 Product type
interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  stock: number;
  image: string;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get<Product[]>("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete product
  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  // ✅ Update product
  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.put<Product>(
        `/products/${editingProduct._id}`,
        editingProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.map((p) => (p._id === res.data._id ? res.data : p)));
      setEditingProduct(null);
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="p-2 border">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                </td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">
                  ₹{p.price}
                  {p.onSale && p.originalPrice && (
                    <span className="line-through text-gray-500 ml-2">
                      ₹{p.originalPrice}
                    </span>
                  )}
                </td>
                <td className="p-2 border">{p.stock}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="bg-yellow-400 px-3 py-1 rounded mr-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-600 text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>

            <input
              className="w-full border p-2 mb-2"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              placeholder="Product Name"
            />

            <input
              className="w-full border p-2 mb-2"
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(e.target.value),
                })
              }
              placeholder="Sale Price"
            />

            <input
              className="w-full border p-2 mb-2"
              type="number"
              value={editingProduct.originalPrice || 0}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  originalPrice: Number(e.target.value),
                })
              }
              placeholder="Original Price"
            />

            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={!!editingProduct.onSale}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    onSale: e.target.checked,
                  })
                }
              />
              On Sale?
            </label>

            <input
              className="w-full border p-2 mb-2"
              type="number"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: Number(e.target.value),
                })
              }
              placeholder="Stock"
            />

            <input
              className="w-full border p-2 mb-2"
              value={editingProduct.image}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  image: e.target.value,
                })
              }
              placeholder="Image URL"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;