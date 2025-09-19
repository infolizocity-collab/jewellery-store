
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./src/components/Navbar";
import Home from "./src/pages/Home";
import Products from "./src/pages/Products";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
