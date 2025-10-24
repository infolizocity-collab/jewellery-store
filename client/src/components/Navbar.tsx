import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import Logo from "../assets/jslogo.jpeg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-pink-600 font-bold underline underline-offset-4"
      : "hover:text-pink-500 transition";

  return (
    <nav className="backdrop-blur-md bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Queens Era Logo"
            className="w-10 h-10 rounded-full shadow-md"
          />
          <span className="text-xl font-bold tracking-wide text-gray-900">
           Queensera Jewels
          </span>
        </Link>

        {/* 🖥 Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-medium items-center">
          <li><Link to="/" className={isActive("/")}>Home</Link></li>
          <li><Link to="/products" className={isActive("/products")}>Products</Link></li>

          {auth?.user && (
            <>
              <li><Link to="/my-orders" className={isActive("/my-orders")}>My Orders</Link></li>
              <li><Link to="/profile" className={isActive("/profile")}>Profile</Link></li>
            </>
          )}

          {/* Cart */}
          <li>
            <Link to="/cart" className={`relative flex items-center gap-1 ${isActive("/cart")}`}>
              <FaShoppingCart className="text-lg" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* 🔑 Auth Buttons (Desktop) */}
        <div className="hidden md:flex gap-4 items-center">
          {auth?.loading ? (
            <span>Loading...</span>
          ) : auth?.user ? (
            <>
              <span className="font-semibold text-gray-800">Hi, {auth.user.name}</span>
              <button
                onClick={auth.logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow hover:scale-105 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow hover:scale-105 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-white border border-pink-400 hover:bg-pink-50 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* 📱 Mobile Menu Btn */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl focus:outline-none text-gray-800"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* 📱 Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-yellow-100/95 px-6 py-6 space-y-4 shadow-inner animate-slideDown">
          <Link to="/" className="block font-medium" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/products" className="block font-medium" onClick={() => setOpen(false)}>Products</Link>

          {auth?.user && (
            <>
              <Link to="/my-orders" className="block font-medium" onClick={() => setOpen(false)}>My Orders</Link>
              <Link to="/profile" className="block font-medium" onClick={() => setOpen(false)}>Profile</Link>
            </>
          )}

          <Link to="/cart" className="block relative font-medium" onClick={() => setOpen(false)}>
            <FaShoppingCart className="inline mr-2" /> Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 left-16 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Mobile Auth */}
          {auth?.loading ? (
            <span className="block">Loading...</span>
          ) : auth?.user ? (
            <>
              <span className="block font-semibold">Hi, {auth.user.name}</span>
              <button
                onClick={() => {
                  auth.logout();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded shadow hover:scale-105 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 rounded bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 rounded border border-pink-400 bg-white hover:bg-pink-50 transition"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
