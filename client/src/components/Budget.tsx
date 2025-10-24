// src/components/Budget.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom"; // ✅ added

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  slug?: string; // ✅ added
}

const budgetRanges = [
  { label: "Under ₹99", min: 0, max: 99 },
  { label: "₹99 – ₹199", min: 99, max: 199 },
  { label: "₹199 – ₹499", min: 199, max: 499 },
  { label: "₹499 – ₹999", min: 499, max: 999 },
];

const Budget = ({ products }: { products: Product[] }) => {
  const { addToCart } = useCart();
  const [selectedBudget, setSelectedBudget] = useState<{
    label: string;
    min: number;
    max: number;
  } | null>(null);

  return (
    <section className="px-12 py-16 bg-white">
      <h3 className="text-2xl mb-8 font-bold text-pink-600">💸 Shop Under Budget</h3>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {budgetRanges.map((budget) => (
          <button
            key={budget.label}
            onClick={() => setSelectedBudget(budget)}
            className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm
              ${
                selectedBudget?.label === budget.label
                  ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md"
                  : "bg-white border border-pink-400 text-pink-600 hover:bg-pink-50"
              }`}
          >
            {budget.label}
          </button>
        ))}
      </div>

      {selectedBudget && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products
            .filter((p) => p.price >= selectedBudget.min && p.price <= selectedBudget.max)
            .map((p) => (
              <motion.div
                key={p._id}
                className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm group hover:shadow-lg transition"
                whileHover={{ scale: 1.03 }}
              >
                {/* ✅ image wrapped in Link */}
                <Link to={`/products/${p.slug}`}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-44 mx-auto mb-4 object-cover rounded-lg cursor-pointer"
                  />
                </Link>

                <h4 className="text-base font-semibold text-gray-800 mb-2">{p.name}</h4>
                <p className="text-pink-600 font-bold">₹{p.price}</p>
                <button
                  onClick={() => addToCart(p)}
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  Add to Cart
                </button>
              </motion.div>
            ))}
        </div>
      )}
    </section>
  );
};

export default Budget;