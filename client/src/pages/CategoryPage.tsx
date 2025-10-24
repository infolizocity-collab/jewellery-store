import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axiosInstance"; // Axios instance with baseURL

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/category/${category}`);
        console.log("Fetched products:", res.data);
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        console.error("Error fetching category products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-6 capitalize">{category} Collection</h2>

      {loading ? (
        <p className="text-gray-400">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-gray-900 p-4 rounded-lg text-center">
              <img
                src={p.image}
                alt={p.name}
                className="h-40 mx-auto object-cover mb-3 rounded"
              />
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-yellow-400 font-bold">₹{p.price}</p>
              {p.originalPrice && (
                <p className="text-gray-400 line-through">₹{p.originalPrice}</p>
              )}
              <Link
                to={`/products/${p.slug}`}
                className="inline-block mt-2 border border-white px-3 py-1 hover:bg-white hover:text-black transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No products available in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;