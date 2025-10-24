import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom"; // ✅ Add this

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  slug?: string; // ✅ Add slug if available
}

const Trending = ({ products }: { products: Product[] }) => {
  const { addToCart } = useCart();

  return (
    <section className="px-12 py-16 bg-pink-50">
      <h3 className="text-2xl mb-8 font-bold text-gray-800">
        🔥 Trending Now
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.slice(0, 8).map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            {/* ✅ Wrap image in Link */}
            <Link to={`/products/${p.slug}`}>
              <img
                src={p.image}
                alt={p.name}
                className="h-48 w-full object-cover rounded-lg mb-4 cursor-pointer"
              />
            </Link>

            <h4 className="font-semibold text-gray-700">{p.name}</h4>
            <p className="text-pink-600 font-bold">₹{p.price}</p>
            <button
              onClick={() => addToCart(p)}
              className="mt-3 w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white py-2 rounded-full"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Trending;  