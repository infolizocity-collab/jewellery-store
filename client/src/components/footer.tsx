// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* ✨ Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-4">
            🦋 Queens Era Jewels
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Where your <span className="text-yellow-400">shine</span> lives.  
            Explore timeless pieces made for every occasion.
          </p>
        </div>

        {/* ⚡ Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { name: "Home", path: "/" },
              { name: "Products", path: "/products" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="hover:text-yellow-400 hover:underline underline-offset-4 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 📦 Customer Care */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Customer Care
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/faq" className="hover:text-yellow-400">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-yellow-400">Shipping & Returns</Link></li>
            <li><Link to="/privacy" className="hover:text-yellow-400">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* 📞 Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Contact
          </h3>
          <p className="text-gray-400">📧 queensera.jewels@gmail.com</p>
          <p className="text-gray-400">📞 +91 9321860540</p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} <span className="text-white font-semibold">Queens Era Jewels</span>. All rights reserved.
      </div>
    </footer>
  );
}
