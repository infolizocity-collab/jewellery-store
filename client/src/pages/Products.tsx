import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/axiosInstance";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

// 🔹 Product type
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  slug: string; // ✅ slug for routing
  onSale?: boolean;
  originalPrice?: number;
  isNew?: boolean;
  category?: string;
  brand?: string;
}

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("popularity");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        if (Array.isArray(res.data)) {
          setProducts(res.data);
          setFiltered(res.data);

          const uniqueCategories = Array.from(
            new Set(
              res.data
                .map((p) => p.category)
                .filter((c): c is string => typeof c === "string" && c.trim() !== "")
            )
          );
          setCategories(["All", ...uniqueCategories]);
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter + sort
  useEffect(() => {
    let temp = [...products];
    if (selectedCategory !== "All") {
      temp = temp.filter((p) => p.category === selectedCategory);
    }
    if (sortOption === "priceLow") temp.sort((a, b) => a.price - b.price);
    else if (sortOption === "priceHigh") temp.sort((a, b) => b.price - a.price);
    else if (sortOption === "newest")
      temp.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    setFiltered(temp);
  }, [selectedCategory, sortOption, products]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const renderBadge = (item: Product) => {
    if (item.onSale)
      return (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          SALE
        </span>
      );
    if (item.isNew)
      return (
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          NEW
        </span>
      );
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-8 py-12
                    bg-gradient-to-br from-pink-50 via-white to-pink-100
                    min-h-screen font-serif">
      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden flex justify-end mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full shadow"
        >
          <FunnelIcon className="h-5 w-5" />
          Filter
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-64 p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`block w-full text-left px-4 py-2 rounded ${
                  selectedCategory === cat
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 hover:bg-pink-100"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="w-72 bg-white p-6 shadow-lg animate-slideIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter by Category</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded ${
                      selectedCategory === cat
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 hover:bg-pink-100"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PRODUCT GRID */}
      <main className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide text-center sm:text-left">
            ✨ Our Exclusive Jewellery Collection ✨
          </h1>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-4 py-2 rounded shadow bg-white w-full sm:w-auto"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center mt-10 text-pink-600 font-medium">
            Loading products...
          </p>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl mb-2">No products available.</p>
            <span className="text-4xl">🛍️</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden group transition-all"
              >
                {renderBadge(item)}

                {/* WISHLIST */}
                <button
                  onClick={() => toggleWishlist(item._id)}
                  className="absolute top-3 right-3 text-xl text-gray-400 hover:text-pink-500 transition"
                >
                  {wishlist.includes(item._id) ? "❤️" : "🤍"}
                </button>

                {/* IMAGE LINK */}
                <Link to={`/products/${item.slug}`}>
                  <div className="overflow-hidden cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 sm:h-64 object-cover transform group-hover:scale-110 transition duration-500"
                    />
                  </div>
                </Link>

                {/* PRODUCT INFO */}
                <div className="p-5 text-center">
                  {item.brand && (
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      {item.brand}
                    </p>
                  )}

                  <Link to={`/products/${item.slug}`}>
                    <h2 className="text-lg font-semibold text-gray-800 truncate cursor-pointer mt-2">
                      {item.name}
                    </h2>
                  </Link>

                  <div className="mt-2">
                    <p className="text-pink-600 font-bold text-lg">
                      ₹{item.price.toLocaleString()}
                    </p>
                    {item.originalPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        ₹{item.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* ADD TO CART */}
                  <button
                    onClick={() =>
                      addToCart({
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="mt-4 w-full bg-gradient-to-r from-pink-500 to-pink-400
                               hover:from-pink-600 hover:to-pink-500 text-white
                               px-4 py-2 rounded-full font-medium shadow-lg
                               opacity-0 group-hover:opacity-100 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
