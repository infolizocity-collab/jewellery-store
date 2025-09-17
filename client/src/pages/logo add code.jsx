// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

import Earrings from "../assets/earrings.jpg";
import Pendants from "../assets/pendants.jpg";
import Logo from "../assets/jslogo.jpeg"; // ✅ Tumhara logo import

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchSaleProducts = async () => {
      try {
        const res = await api.get("http://localhost:5000/api/products/sale");
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
    <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-white text-black font-serif">
      {/* 🔥 Hero Section with Logo */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6">
        {/* Logo */}
        <motion.img
          src={Logo}
          alt="SS Jewels Logo"
          className="w-40 h-40 mb-6 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
            ELEGANT <br /> TIMELESS <br /> JEWELRY
          </h2>
          <Link
            to="/products"
            className="inline-block border-2 border-pink-500 px-8 py-3 mt-4 
                       hover:bg-pink-500 hover:text-white transition rounded-full 
                       shadow-lg hover:shadow-pink-300"
          >
            SHOP NOW
          </Link>
        </motion.div>
      </section>

      {/* 🛍 Categories Section */}
      <section className="px-12 py-16">
        <h3 className="text-2xl mb-8 text-gray-900">✨ Shop by Category</h3>
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
                className="w-20 h-20 rounded-full object-cover border-2 border-pink-400 mb-2"
              />
              <span className="text-sm text-gray-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Baaki tumhara trending, sale, korean jewelry, hamper section same rehne de */}
      {/* ✅ Sirf background aur logo add kiya gaya hai */}

      {/* Footer with Logo */}
      <footer className="border-t border-gray-300 text-center py-6 text-gray-700 text-sm bg-gradient-to-r from-pink-100 via-purple-100 to-white">
        <div className="flex flex-col items-center">
          <img src={Logo} alt="SS Jewels Logo" className="w-16 h-16 mb-2 rounded-full" />
          <p>© 2025 SS Jewels. Where your shine lives ✨</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
