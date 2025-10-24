// src/components/Sale.tsx
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug?: string;
}

const Sale = ({ saleProducts }: { saleProducts: Product[] }) => {
  const { addToCart } = useCart();

  return (
    <section className="px-12 py-16 bg-gradient-to-r from-red-50 to-pink-100">
      <h3 className="text-2xl mb-8 font-bold text-red-600">
        🎉 Mega Sale
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {saleProducts.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition relative"
          >
            <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs rounded-full">
              {Math.round(
                ((p.originalPrice || p.price) - p.price) /
                  (p.originalPrice || p.price) *
                  100
              )}
              % OFF
            </span>

            {/* ✅ Wrap image in Link */}
            <Link to={`/products/${p.slug}`}>
              <img
                src={p.image}
                alt={p.name}
                className="h-48 w-full object-cover rounded-lg mb-4 cursor-pointer"
              />
            </Link>

            <h4 className="font-semibold text-gray-700">{p.name}</h4>
            <p className="text-red-600 font-bold">
              ₹{p.price}{" "}
              <span className="line-through text-gray-400 text-sm ml-2">
                ₹{p.originalPrice}
              </span>
            </p>
            <button
              onClick={() => addToCart(p)}
              className="mt-3 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-full"
            >
              Grab Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Sale;