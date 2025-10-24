import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../../components/admin/sidebar";
import Swal from "sweetalert2";
import DashboardHome from "../../pages/admin/DashboardHome";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isDashboardRoute =
    location.pathname === "/admin" || location.pathname === "/admin/";

  useEffect(() => {
    setTimeout(() => {
      Swal.fire({
        title: "Welcome!",
        text: "Admin Dashboard loaded successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    }, 100);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-black text-white">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black text-white transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 md:hidden`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:block">
              Welcome, Admin
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {isDashboardRoute ? (
            <DashboardHome />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;