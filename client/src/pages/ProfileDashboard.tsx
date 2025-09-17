import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfileDashboard = () => {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

  if (!auth) return null;
  const { user, logout } = auth;

  const menuItems = [
    { key: "profile", label: "👤 My Profile" },
    { key: "orders", label: "📦 My Orders" },
    { key: "wishlist", label: "❤️ Wishlist" },
    { key: "addresses", label: "🏠 Saved Addresses" },
    { key: "password", label: "🔑 Change Password" },
    { key: "logout", label: "🚪 Logout" },
  ];

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() =>
                  item.key === "logout" ? logout() : setActiveTab(item.key)
                }
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === item.key
                    ? "bg-yellow-300 font-semibold"
                    : "hover:bg-yellow-200"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">👤 Profile Info</h2>
            {user ? (
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Role:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
              </div>
            ) : (
              <p>Please login to view profile.</p>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>
            <p className="text-gray-600">
              Your orders will appear here (connect with API).
            </p>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">❤️ Wishlist</h2>
            <p className="text-gray-600">
              Your wishlist products will appear here.
            </p>
          </div>
        )}

        {activeTab === "addresses" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏠 Saved Addresses</h2>
            <p className="text-gray-600">
              Manage your delivery addresses here.
            </p>
          </div>
        )}

        {activeTab === "password" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🔑 Change Password</h2>
            <form className="space-y-4 max-w-sm">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-3 py-2 border rounded"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileDashboard;
