// src/components/KoreanCollection.tsx
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom"; // ✅ added

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  onSale?: boolean;
  slug?: string; // ✅ added
}

const KoreanCollection = ({ products }: { products: Product[] }) => {
  const { addToCart } = useCart();

  return (
    <section className="px-12 py-16 bg-gradient-to-b from-white to-pink-50">
      <h3 className="text-2xl mb-8 font-bold text-pink-600">
        ✨ Korean Jewelry Collection
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products
          .filter((p) => p.category?.toLowerCase() === "korean jewelry")
          .map((p) => (
            <motion.div
              key={p._id}
              className="relative bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm group hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
            >
              {p.onSale && (
                <span className="absolute top-2 right-2 bg-red-500 text-xs px-3 py-1 rounded-full text-white shadow-md">
                  SALE
                </span>
              )}

              {/* ✅ image wrapped in Link */}
              <Link to={`/products/${p.slug}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-44 mx-auto mb-4 object-cover rounded-lg cursor-pointer"
                />
              </Link>

              <h4 className="text-base font-semibold text-gray-800">{p.name}</h4>
              <p className="text-pink-600 font-bold">₹{p.price}</p>
              <button
                onClick={() =>
                  addToCart({
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                  })
                }
                className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default KoreanCollection;