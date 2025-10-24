import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/products", label: "Manage Products" },
    { path: "/admin/add-product", label: "Add Product" },
    { path: "/admin/orders", label: "Manage Orders" },
    { path: "/admin/users", label: "Manage Users" }, // future expansion
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-black text-white p-5 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500 text-center">
        Admin Panel
      </h2>
      <nav className="flex flex-col gap-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-2 rounded-md transition ${
              location.pathname === item.path
                ? "bg-yellow-500 text-black font-semibold"
                : "hover:bg-gray-800 hover:text-yellow-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
