// src/pages/Products.tsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import api from "@/utils/axiosInstance";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("http://localhost:5000/api/products"); // 👈 backend API
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Our Jewellery Collection
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl shadow-md p-4 hover:shadow-xl transition text-center bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-3">{item.name}</h2>
              <p className="text-gray-600">₹{item.price.toLocaleString()}</p>

              <button
                onClick={() =>
                  addToCart({
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    img: item.image,
                  })
                }
                className="mt-3 bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg font-medium"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
