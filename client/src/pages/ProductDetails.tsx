// src/pages/ProductDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  stock: number;
  image: string;
  images?: string[];
  category?: string;
  slug: string;
  reviews?: Review[];
}

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get<Product>(`/products/slug/${slug}`);
        setProduct(res.data);
        setSelectedImage(res.data.images?.[0] || res.data.image);

        if (res.data.category) {
          const rel = await api.get<Product[]>(`/products`);
          const filtered = rel.data.filter(
            (p) => p.category === res.data.category && p.slug !== res.data.slug
          );
          setRelated(filtered.slice(0, 8));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const avgRating =
    product?.reviews && product.reviews.length > 0
      ? product.reviews.reduce((a, b) => a + b.rating, 0) /
        product.reviews.length
      : 0;

  const submitReview = async () => {
    if (!product) return;
    setSubmitting(true);
    try {
      await api.post(
        `/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const updated = await api.get<Product>(`/products/slug/${slug}`);
      setProduct(updated.data);
      setComment("");
      setRating(5);
      alert("✅ Review submitted!");
    } catch (err) {
      console.error("Review error:", err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product…</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-serif text-gray-800">
      {/* ===== PRODUCT MAIN ===== */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Left: Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="relative group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full max-w-md rounded-xl shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.onSale && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                SALE
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {[product.image, ...(product.images || [])].map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-lg object-cover cursor-pointer border ${
                  selectedImage === img ? "border-pink-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:sticky md:top-24 self-start"
        >
          <h1 className="text-4xl font-extrabold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < avgRating ? "text-yellow-400" : "text-gray-300"}
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-500">
              ({product.reviews?.length || 0} Reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <p className="text-3xl font-bold text-pink-600">₹{product.price}</p>
            {product.originalPrice && product.onSale && (
              <p className="text-lg text-gray-400 line-through">
                ₹{product.originalPrice}
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <p className="mb-2">
            <span className="font-semibold">Category:</span>{" "}
            {product.category || "N/A"}
          </p>
          <p className="mb-6">
            <span className="font-semibold">Stock:</span>{" "}
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              disabled={product.stock === 0}
              onClick={() =>
                addToCart({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="px-8 py-3 rounded-full border-2 border-pink-500 text-pink-600 font-semibold hover:bg-pink-50 transition"
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Info Accordion */}
          <div className="mt-10 border-t pt-6 space-y-4">
            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-semibold">
                📦 Return & Replacement Policy
              </summary>
              <p className="mt-2 text-gray-600">
                Easy 7-day return policy. Free replacement for damaged items.
              </p>
            </details>
            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-semibold">
                🛡 Warranty
              </summary>
              <p className="mt-2 text-gray-600">
                This product comes with 6 months manufacturer warranty.
              </p>
            </details>
            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-semibold">
                🎁 Packaging
              </summary>
              <p className="mt-2 text-gray-600">
                Delivered in a premium gift box with protective packaging.
              </p>
            </details>
          </div>
        </motion.div>
      </div>

      {/* ===== REVIEWS ===== */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-6">⭐ Customer Reviews</h2>

        {product.reviews?.length ? (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {product.reviews.map((r, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-sm"
              >
                <p className="font-semibold mb-1">{r.name}</p>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      className={j < r.rating ? "text-yellow-500" : "text-gray-300"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No reviews yet. Be the first!</p>
        )}

        {/* Review Form */}
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => setRating(n)}
                className={`cursor-pointer text-2xl ${
                  n <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience..."
            className="border p-3 rounded w-full mb-3"
          />
          <button
            onClick={submitReview}
            disabled={submitting}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold shadow disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      </section>

      {/* ===== RELATED PRODUCTS ===== */}
      {related.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8">🔗 You may also like</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {related.map((p) => (
              <Link
                to={`/products/${p.slug}`}
                key={p._id}
                className="min-w-[220px] group border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="relative mb-4">
                  {p.onSale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-xs text-white px-2 py-1 rounded-full">
                      SALE
                    </span>
                  )}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                <p className="text-pink-600 font-bold mt-1">₹{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== STICKY MOBILE ADD TO CART ===== */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4 flex justify-between items-center md:hidden">
        <p className="text-lg font-bold text-pink-600">₹{product.price}</p>
        <button
          onClick={() =>
            addToCart({
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
            })
          }
          className="px-6 py-2 bg-pink-500 text-white rounded-full shadow"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
