import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/utils/axiosInstance";
import { useCart } from "../context/CartContext";  

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
  category?: string;
  slug: string;
  reviews?: Review[];
}

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Review form states
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`http://localhost:5000/api/products/slug/${slug}`);
        setProduct(res.data);

        if (res.data.category) {
          const relatedRes = await api.get("http://localhost:5000/api/products");
          const filtered = relatedRes.data.filter(
            (p: Product) => p.category === res.data.category && p.slug !== res.data.slug
          );
          setRelated(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // ✅ Submit review
  const submitReview = async () => {
    if (!product) return;
    setSubmitting(true);

    try {
      await api.post(
        `http://localhost:5000/api/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } } // user token
      );

      // ✅ Reload product after review
      const updated = await api.get(`http://localhost:5000/api/products/slug/${slug}`);
      setProduct(updated.data);

      setComment("");
      setRating(5);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("❌ Review submit error:", err);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg shadow-lg w-full max-w-md h-[400px] object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-2xl font-semibold mb-4">
            ₹{product.price}
            {product.onSale && product.originalPrice && (
              <span className="text-gray-500 line-through ml-3 text-lg">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="mb-2">
            <span className="font-semibold">Stock:</span>{" "}
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>
          <p className="mb-6">
            <span className="font-semibold">Category:</span>{" "}
            {product.category || "N/A"}
          </p>

          <button
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">⭐ Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {product.reviews.map((r, i) => (
              <div key={i} className="p-4 border rounded-lg bg-gray-50">
                <p className="font-semibold">{r.name}</p>
                <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
                <p className="text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">No reviews yet. Be the first to review!</p>
        )}

        {/* Review Form */}
        <div className="border rounded-lg p-4 bg-white shadow">
          <h3 className="font-semibold mb-3">Write a Review</h3>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded w-full mb-3"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Average</option>
            <option value={2}>2 - Poor</option>
            <option value={1}>1 - Terrible</option>
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 rounded w-full mb-3"
            placeholder="Write your review..."
            rows={3}
          />
          <button
            onClick={submitReview}
            disabled={submitting}
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">🔗 You may also like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((p) => (
              <div key={p._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded mb-3"
                />
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-yellow-600 font-bold">₹{p.price}</p>
                <Link
                  to={`/products/${p.slug}`}
                  className="mt-2 inline-block text-sm border border-yellow-400 px-3 py-1 hover:bg-yellow-400 hover:text-black transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
