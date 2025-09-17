// Hero.tsx
import React from "react";

export default function Hero() {
  return (
    <section
      className="h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Elegant Timeless Jewelry</h1>
        <p className="text-lg md:text-xl mb-6">Discover the finest collection curated for you</p>
        <button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold shadow-lg">
          Shop Now
        </button>
      </div>
    </section>
  );
}
