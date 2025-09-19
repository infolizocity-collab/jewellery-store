import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Outlet /> {/* yaha nested routes render honge */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
