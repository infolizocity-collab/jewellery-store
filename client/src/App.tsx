import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/footer";
import Products from "./pages/Products";
import Cart from "./pages/Cart";  
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ add this
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import AddProduct from "./pages/admin/AddProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Sale from "./pages/Sale";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import CustomHamper from "./pages/CustomHamper";
import ManageUsers from "./pages/admin/ManageUsers";
import Profile from "./pages/Profile";


function App() {
  return (
    <AuthProvider>        {/* ✅ wrap everything inside AuthProvider */}
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          {/* Navbar har page pe upar */}
          <Navbar />

          {/* Main content */}
          <main className="flex-grow pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/products/:slug" element={<ProductDetails />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/hamper" element={<CustomHamper />} />
              <Route path="/profile" element={<Profile />} />

              {/* ✅ User Orders */}
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />

              {/* ✅ Admin Routes - Nested with protection */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="products" element={<ManageProducts />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>
            </Routes>
          </main>

          {/* Footer har page pe niche */}
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
