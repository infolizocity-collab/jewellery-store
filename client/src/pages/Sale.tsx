
import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Sale = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/sale");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching sale products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading Sale Products...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">🔥 Sale Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No sale products available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-yellow-600 font-bold">₹{p.price}</p>
                {p.originalPrice && (
                  <p className="text-gray-500 line-through text-sm">
                    ₹{p.originalPrice}
                  </p>
                )}
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/products/${p.slug}`}
                    className="flex-1 text-center border border-gray-800 px-3 py-1 rounded hover:bg-gray-800 hover:text-white transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => addToCart(p)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-3 py-1 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sale;
