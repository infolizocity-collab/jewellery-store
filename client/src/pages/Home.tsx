// src/pages/Home.tsx
import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext"; 

import Earrings from "../assets/earrings.jpg";
import Pendants from "../assets/pendants.jpg";

// ✅ Product type
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  originalPrice?: number;
  category?: string;
  slug?: string;
  onSale?: boolean;
  
}

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<{label: string, min: number, max: number} | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchSaleProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products/sale");
        setSaleProducts(res.data);
      } catch (err) {
        console.error("Error fetching sale products:", err);
      }
    };

    fetchProducts();
    fetchSaleProducts();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen font-serif text-black bg-gradient-to-br from-pink-100 via-white to-pink-200">
      
      {/* Hero Section */}
      <section
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-start px-12"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3')",
        }}
      >
        <motion.div
          className="relative z-10 text-black max-w-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-6xl font-extrabold leading-tight mb-6">
            ELEGANT <br /> TIMELESS <br /> JEWELRY
          </h2>
          <Link
            to="/products"
            className="inline-block border-2 border-black px-8 py-3 mt-4 
                       hover:bg-black hover:text-white transition rounded-full shadow-lg"
          >
            SHOP NOW
          </Link>
        </motion.div>
      </section>

      {/* 🛍 Categories Section */}
      <section className="px-12 py-16">
        <h3 className="text-2xl mb-8">✨ Shop by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {[
            { name: "Pendants", img: Pendants },
            { name: "Earrings", img: Earrings },
            { name: "Bracelets", img: Earrings },
            { name: "Rings", img: Earrings },
            { name: "Anklets", img: Earrings },
            { name: "Sets", img: Earrings },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.name.toLowerCase()}`}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-pink-300 mb-2"
              />
              <span className="text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 💸 Shop Under Budget Section */}
      <section className="px-12 py-16 bg-white/70 rounded-lg mx-4 shadow-lg">
        <h3 className="text-2xl mb-8 text-pink-600">💸 Shop Under Budget</h3>

        {/* Budget Options */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          {[
            { label: "Under ₹99", min: 0, max: 99 },
            { label: "₹99 – ₹199", min: 99, max: 199 },
            { label: "₹199 – ₹499", min: 199, max: 499 },
            { label: "₹499 – ₹999", min: 499, max: 999 },
          ].map((budget) => (
            <button
              key={budget.label}
              onClick={() => setSelectedBudget(budget)}
              className={`py-6 rounded-lg font-bold transition ${
                selectedBudget?.label === budget.label
                  ? "bg-pink-500 text-white"
                  : "bg-white border border-pink-500 hover:bg-pink-500 hover:text-white"
              }`}
            >
              {budget.label}
            </button>
          ))}
        </div>

        {/* Filtered Products */}
        {selectedBudget && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter(
                (p) => p.price >= selectedBudget.min && p.price <= selectedBudget.max
              )
              .map((p) => (
                <motion.div
                  key={p._id}
                  className="bg-white p-4 rounded-lg text-center group hover:scale-105 transition shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 mx-auto mb-3 object-cover rounded-lg"
                  />
                  <h4 className="text-lg font-semibold text-black">{p.name}</h4>
                  <p className="text-pink-600">₹{p.price}</p>

                  <button
                    onClick={() =>
                      addToCart({
                        _id: p._id,
                        name: p.name,
                        price: p.price,
                        image: p.image,
                        
                        
                      })
                    }
                    className="mt-3 px-4 py-2 bg-pink-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
          </div>
        )}

        {/* No Products Found */}
        {selectedBudget &&
          products.filter(
            (p) => p.price >= selectedBudget.min && p.price <= selectedBudget.max
          ).length === 0 && (
            <p className="text-center text-gray-600">
              No products under this budget
            </p>
          )}
      </section>

      {/* 🔥 Trending Collection */}
      <section className="px-12 py-16">
        <h3 className="text-2xl mb-8">TRENDING COLLECTION</h3>
        {products.length > 0 ? (
          <Slider {...settings}>
            {products.map((p) => (
              <div key={p._id} className="px-3">
                <motion.div
                  className="relative bg-white rounded-lg p-6 text-center group cursor-pointer shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  {p.onSale && (
                    <span className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded text-white">
                      SALE
                    </span>
                  )}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="mx-auto h-40 object-cover mb-4 rounded-lg"
                  />
                  <p className="text-lg font-semibold">{p.name}</p>
                  <p className="text-pink-600 font-bold">₹{p.price}</p>

                  <button
                    onClick={() =>
                      addToCart({
                        _id: p._id,
                        name: p.name,
                        price: p.price,
                        image: p.image,
                        
                      })
                    }
                    className="mt-3 px-4 py-2 bg-pink-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
      </section>

      {/* 🔥 Sale Products Section */}
      <section className="px-12 py-16 bg-white/70 rounded-lg mx-4 shadow-lg">
        <h3 className="text-2xl mb-8 text-pink-600">🔥 ON SALE</h3>
        {saleProducts.length > 0 ? (
          <Slider {...settings}>
            {saleProducts.map((p) => (
              <div key={p._id} className="px-3">
                <div className="relative bg-white rounded-lg p-6 text-center hover:scale-105 transition cursor-pointer border border-pink-500 shadow-md">
                  <span className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded text-white">
                    SALE
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="mx-auto h-40 object-cover mb-4 rounded-lg"
                  />
                  <p className="text-lg font-semibold">{p.name}</p>
                  <div className="mt-2">
                    <p className="text-red-500 font-bold">₹{p.price}</p>
                    {p.originalPrice && (
                      <p className="text-gray-400 line-through">₹{p.originalPrice}</p>
                    )}
                  </div>
                  <Link
                    to={`/products/${p.slug}`}
                    className="mt-2 inline-block text-sm border border-pink-500 px-4 py-1 hover:bg-pink-500 hover:text-white transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-600">No sale products available</p>
        )}
      </section>

      {/* ✨ Korean Jewelry Section */}
      <section className="px-12 py-16">
        <h3 className="text-2xl mb-8 text-pink-600">✨ Korean Jewelry Collection</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products
            .filter((p) => p.category?.toLowerCase() === "korean jewelry")
            .map((p) => (
              <motion.div
                key={p._id}
                className="relative bg-white p-4 rounded-lg text-center group hover:scale-105 transition shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                {p.onSale && (
                  <span className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded text-white">
                    SALE
                  </span>
                )}
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-40 mx-auto mb-3 object-cover rounded-lg"
                />
                <h4 className="text-lg font-semibold">{p.name}</h4>
                <p className="text-pink-600">₹{p.price}</p>

                <button
                  onClick={() =>
                    addToCart({
                      _id: p._id,
                      name: p.name,
                      price: p.price,
                      image: p.image,
                    })
                  }
                  className="mt-3 px-4 py-2 bg-pink-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Add to Cart
                </button>
              </motion.div>
            ))}
        </div>
      </section>

      {/* 🎁 Custom Hamper CTA */}
      <section className="px-12 py-16 bg-white/70 rounded-lg mx-4 shadow-lg text-center">
        <h3 className="text-2xl mb-6">🎁 Create Your Own Hamper</h3>
        <p className="text-gray-600 mb-6">
          Design a hamper with your favorite jewelry pieces and make it truly personal.
        </p>
        <Link
          to="/hamper"
          className="inline-block bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600"
        >
          Start Customizing
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 text-center py-6 text-gray-600 text-sm mt-8">
        © 2025 Jewels Store. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
