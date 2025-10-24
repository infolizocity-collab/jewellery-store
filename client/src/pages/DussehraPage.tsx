import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import api from "@/utils/axiosInstance";

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

const DussehraPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDussehraProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products?tag=dussehra");
        const featuredOnly = (res.data || []).filter((p) => p.featured); // ✅ filter featured
        setProducts(featuredOnly);
      } catch (err) {
        console.error("Error fetching Dussehra products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDussehraProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 🔸 Banner */}
      <div className="relative">
        <img
          src="/assets/dussehra.jpg"
          alt="Dussehra Celebration"
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">DUSSEHRA CELEBRATION</h1>
          <p className="text-lg sm:text-xl mt-2">Victory of Style Begins Here 🏹</p>
        </div>
      </div>

      {/* 🔸 Product Grid */}
      <div className="px-4 sm:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Featured Dussehra Picks ({products.length})
        </h2>

        {loading ? (
          <p className="text-center text-orange-600">Loading Dussehra items...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No featured Dussehra products found.</p>
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

                {/* 🖼️ Image */}
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `/assets/${item.image}`
                  }
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = "/assets/fallback.jpg")}
                  className="w-full h-48 sm:h-56 object-cover rounded-t-xl"
                />

                {/* 📦 Info */}
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium truncate">{item.name}</h3>
                  <p className="text-orange-600 font-bold text-lg">
                    ₹{item.price.toLocaleString()}
                  </p>
                  {item.originalPrice && (
                    <p className="text-gray-400 line-through text-sm">
                      ₹{item.originalPrice.toLocaleString()}
                    </p>
                  )}
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
                    className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full text-sm font-medium transition disabled:opacity-50"
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

export default DussehraPage;