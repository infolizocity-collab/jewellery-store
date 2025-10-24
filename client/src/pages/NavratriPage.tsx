import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../utils/axiosInstance";
import bannerImage from "../assets/navratri.jpg";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  onSale?: boolean;
  featured?: boolean; // ✅ added for filtering
}

const NavratriPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchNavratriProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products?tag=navratri");
        const featuredOnly = (res.data || []).filter((p) => p.featured); // ✅ filter featured
        setProducts(featuredOnly);
      } catch (err) {
        console.error("Error fetching Navratri products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNavratriProducts();
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 🔸 Banner */}
      <div className="relative">
        <img
          src={bannerImage}
          alt="Navratri Special"
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">NAVRATRI SPECIAL COLLECTION</h1>
          <p className="text-lg sm:text-xl mt-2">Twirl into festive glam ✨</p>
        </div>
      </div>

      {/* 🔸 Navratri Product Grid */}
      <div className="px-4 sm:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Featured Navratri Picks ({products.length})
        </h2>

        {loading ? (
          <p className="text-center text-pink-600">Loading Navratri items...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No featured Navratri products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item._id}
                className="relative bg-white border rounded-xl shadow hover:shadow-lg transition group"
              >
                {/* 🔴 Sold Out Badge */}
                {item.stock === 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    SOLD OUT
                  </span>
                )}

                {/* ❤️ Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(item._id)}
                  className="absolute top-3 right-3 text-lg"
                >
                  {wishlist.includes(item._id) ? "❤️" : "🤍"}
                </button>

                {/* 🖼️ Image */}
                <img
                  src={item.image?.startsWith("http") ? item.image : `/assets/${item.image}`}
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = "/assets/fallback.jpg")}
                  className="w-full h-48 sm:h-56 object-cover rounded-t-xl"
                />

                {/* 📦 Info */}
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium truncate">{item.name}</h3>

                  <div className="mt-2">
                    <p className="text-pink-600 font-bold text-lg">
                      ₹{item.price?.toLocaleString() ?? "N/A"}
                    </p>
                    {item.originalPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        ₹{item.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <button
                    disabled={item.stock === 0}
                    onClick={() =>
                      addToCart({
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-full text-sm font-medium transition disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavratriPage;