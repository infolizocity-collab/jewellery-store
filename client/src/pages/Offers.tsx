import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
}

export default function Offers() {
  const [offers, setOffers] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // ✅ API endpoint jo sale products deta ho
        const res = await api.get<Product[]>("/products/sale");
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6 md:p-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
        🎉 Exclusive Offers
      </h1>

      {offers.length === 0 ? (
        <p className="text-center text-gray-600">No offers available right now.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {offers.map((p) => (
            <motion.div
              key={p._id}
              className="bg-white border border-pink-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              whileHover={{ scale: 1.03 }}
            >
              <Link to={`/products/${p.slug}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {p.name}
                </h2>
              </Link>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-pink-600 font-bold">₹{p.price}</span>
                {p.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    ₹{p.originalPrice}
                  </span>
                )}
              </div>

              <button
                onClick={() =>
                  addToCart({
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                  })
                }
                className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white py-2 rounded-full font-medium hover:opacity-90"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
