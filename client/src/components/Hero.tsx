// src/components/HeroSlider.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ✅ Har banner ke sath route add kar do
import banner1 from "../assets/diwalisale.jpg";
import banner2 from "../assets/navratri.jpg";
import banner3 from "../assets/dussehra.jpg";

const banners = [
  { image: banner1, link: "/diwali-sale" },
  { image: banner2, link: "/navratri" },
  { image: banner3, link: "/dussehra" },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  // 🔄 Auto Slide every 5 seconds
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* ✅ Banner Clickable */}
          <Link to={banners[current].link}>
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${banners[current].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradient Overlay (optional) */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dots Navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              current === index ? "bg-white scale-125" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
