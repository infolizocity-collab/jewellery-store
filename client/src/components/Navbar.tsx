import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/jslogo.jpeg"; // ✅ apna logo import (image src/assets me hona chahiye)

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const isActive = (path: string) =>
    location.pathname === path ? "text-black font-bold" : "hover:text-gray-700";

  return (
    <nav className="bg-yellow-300 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="JS Jewels Logo"
            className="w-10 h-10 rounded-full shadow-md"
          />
          <span className="text-xl font-bold">JS Jewels</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-medium items-center">
          <li><Link to="/" className={isActive("/")}>Home</Link></li>
          <li><Link to="/products" className={isActive("/products")}>Products</Link></li>
          <li><Link to="/about" className={isActive("/about")}>About</Link></li>
          <li><Link to="/contact" className={isActive("/contact")}>Contact</Link></li>

          {/* ✅ My Orders & Profile (only when logged in) */}
          {auth?.user && (
            <>
              <li><Link to="/my-orders" className={isActive("/my-orders")}>My Orders</Link></li>
              <li><Link to="/profile" className={isActive("/profile")}>Profile</Link></li>
            </>
          )}

          {/* Cart */}
          <li>
            <Link to="/cart" className={`relative ${isActive("/cart")}`}>
              🛒 Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* Auth */}
        <div className="hidden md:flex gap-4 items-center">
          {auth?.loading ? (
            <span>Loading...</span>
          ) : auth?.user ? (
            <>
              <span className="font-semibold">Hi, {auth.user.name}</span>
              <button
                onClick={auth.logout}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-100">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Btn */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-yellow-200 px-4 py-2 space-y-2">
          <Link to="/" className="block" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/products" className="block" onClick={() => setOpen(false)}>Products</Link>
          <Link to="/about" className="block" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" className="block" onClick={() => setOpen(false)}>Contact</Link>

          {/* ✅ My Orders & Profile (only when logged in) */}
          {auth?.user && (
            <>
              <Link to="/my-orders" className="block" onClick={() => setOpen(false)}>My Orders</Link>
              <Link to="/profile" className="block" onClick={() => setOpen(false)}>Profile</Link>
            </>
          )}

          <Link to="/cart" className="block relative" onClick={() => setOpen(false)}>
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 left-10 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
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
                className="block w-full text-left px-4 py-2 bg-black text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="block" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
