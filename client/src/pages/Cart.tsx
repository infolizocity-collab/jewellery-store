import React from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-10">
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-bold mt-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some products to continue shopping!</p>
        <Link
          to="/products"
          className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg font-medium"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        {cart.map((item, index) => (
          <div
            key={item._id || item.id || index}
            className="flex items-center justify-between border-b pb-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.img || item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(
                    item._id || item.id,
                    Math.max(item.quantity - 1, 1)
                  )
                }
                className="p-1 border rounded"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) =>
                  updateQuantity(
                    item._id || item.id,
                    parseInt(e.target.value) || 1
                  )
                }
                className="w-12 text-center border rounded"
              />
              <button
                onClick={() =>
                  updateQuantity(item._id || item.id, item.quantity + 1)
                }
                className="p-1 border rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold">
                ₹{item.price * item.quantity}
              </span>
              <button
                onClick={() => removeFromCart(item._id || item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Cart Total + Buttons */}
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-bold">Total: ₹{total}</h2>
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg font-medium"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
