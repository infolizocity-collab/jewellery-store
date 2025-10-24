// src/pages/Home.tsx
import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Budget from "../components/Budget";
import Trending from "../components/Trending";
import Sale from "../components/Sale";
import KoreanCollection from "../components/KoreanCollection";
import Hamper from "../components/Hamper";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);

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

  return (
    <div className="min-h-screen font-serif text-black bg-gradient-to-br from-pink-100 via-white to-pink-200">
      <Hero />
      <Categories />
      <Budget products={products} />
      <Trending products={products} />
      <Sale saleProducts={saleProducts} />
      <KoreanCollection products={products} />
      <Hamper />

      <footer className="border-t border-gray-300 text-center py-6 text-gray-600 text-sm mt-8">
        © 2025 Queensera Jewels . All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
