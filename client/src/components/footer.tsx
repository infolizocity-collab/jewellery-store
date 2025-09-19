// Footer.tsx

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">💍 Jewellery Store</h2>
          <p>Where your shine lives.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-yellow-400">Products</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p>Email: support@jewellery.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="flex gap-4 mt-3">
            <a href="#" className="hover:text-yellow-400">🌐</a>
            <a href="#" className="hover:text-yellow-400">📘</a>
            <a href="#" className="hover:text-yellow-400">📸</a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Jewellery Store. All rights reserved.
      </div>
    </footer>
  );
}
