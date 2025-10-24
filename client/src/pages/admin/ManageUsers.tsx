import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePic?: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      
      const res = await api.get<User[]>("/admin/users");
      setUsers(res.data);
    } catch (err: any) {
      console.error("❌ Error fetching users:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized – Please login again");
      } else if (err.response?.status === 403) {
        setError("Forbidden – Only admins can access this page");
      } else {
        setError("Failed to load users. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (id: string, isAdmin: boolean) => {
    try {
      await api.put(`/admin/users/${id}`, { isAdmin: !isAdmin });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isAdmin: !isAdmin } : u))
      );
    } catch (err) {
      console.error("❌ Error toggling admin:", err);
      alert("Failed to update admin status");
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return <p className="text-center mt-10 animate-pulse">Loading users...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">👥 Manage Users</h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-lg transition flex items-center gap-4"
            >
              <img
                src={user.profilePic || "/default-profile.png"}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p
                  className={`mt-1 font-semibold text-sm ${
                    user.isAdmin ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "User"}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => toggleAdmin(user._id, user.isAdmin)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Toggle Admin
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
