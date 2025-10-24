import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axiosInstance";
import {
  FaCloudUploadAlt,
  FaBoxOpen,
  FaHeart,
  FaUserAlt,
  FaKey,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

interface Order {
  _id: string;
  total: number;
  status: string;
}

interface ProfilePicResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    profilePic?: string;
  };
}

const Profile: React.FC = () => {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Change password states
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  if (!auth) return null;
  const { user, logout, updateProfile } = auth;

  // ✅ Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === "orders") {
        try {
          setLoadingOrders(true);
          const res = await api.get<Order[]>("/orders/myorders");
          setOrders(res.data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    fetchOrders();
  }, [activeTab]);

  // ✅ File preview
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Upload profile picture
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = fileInputRef.current;
    if (!input || !input.files || input.files.length === 0) {
      alert("Choose an image first");
      return;
    }
    const file = input.files[0];
    const form = new FormData();
    form.append("profilePic", file);
    try {
      setUploading(true);
      const res = await api.post<ProfilePicResponse>("/users/profile-pic", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateProfile(res.data.user);
      setPreview(null);
      alert("Profile picture updated!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err?.response?.data?.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("New passwords do not match");
      return;
    }
    try {
      setChangingPass(true);
      await api.post("/users/change-password", {
        currentPassword: oldPass,
        newPassword: newPass,
      });
      alert("Password updated successfully");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err: any) {
      console.error("Password change error:", err);
      alert(err?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  const tabs = [
    { key: "profile", label: "My Profile", icon: <FaUserAlt /> },
    { key: "orders", label: "My Orders", icon: <FaBoxOpen /> },
    { key: "wishlist", label: "Wishlist", icon: <FaHeart /> },
    { key: "addresses", label: "Addresses", icon: <FaHome /> },
    { key: "password", label: "Change Password", icon: <FaKey /> },
    { key: "logout", label: "Logout", icon: <IoLogOutOutline /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">👤 Profile Info</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md">
                {preview ? (
                  <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                ) : user?.profilePic ? (
                  <img src={user.profilePic} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-200 text-4xl">🙂</div>
                )}
              </div>

              <div>
                <p className="text-xl font-bold">{user?.name}</p>
                <p className="text-gray-600">{user?.email}</p>
                <form onSubmit={handleUpload} className="mt-4 flex flex-wrap gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                    id="profilePicInput"
                  />
                  <label
                    htmlFor="profilePicInput"
                    className="px-4 py-2 border border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-100 flex items-center gap-2"
                  >
                    <FaCloudUploadAlt /> Choose Image
                  </label>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">Name:</span> {user?.name}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    user?.role === "admin"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {user?.role}
                </span>
              </p>
            </div>
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">📦 My Orders</h2>
            {loadingOrders ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">No orders yet.</p>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className="border border-yellow-200 bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-800">Order ID: {order._id}</p>
                    <p className="text-gray-600">Total: ₹{order.total}</p>
                    <p className="mt-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "wishlist":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">❤️ Wishlist</h2>
            <p className="text-gray-600">Your saved wishlist items will appear here.</p>
          </div>
        );

      case "addresses":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏠 Saved Addresses</h2>
            <p className="text-gray-600">Manage your shipping addresses here.</p>
          </div>
        );

      case "password":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">🔑 Change Password</h2>
            <form
              onSubmit={handleChangePassword}
              className="max-w-md space-y-4 bg-white p-6 rounded shadow"
            >
              <div>
                <label className="block mb-1 text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={changingPass}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                {changingPass ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-gradient-to-b from-yellow-50 to-yellow-100 p-5 border-r transform transition-transform duration-200 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-2xl font-extrabold text-gray-800">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        <ul className="space-y-3">
          {tabs.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  if (item.key === "logout") logout();
                  else setActiveTab(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  activeTab === item.key
                    ? "bg-yellow-300 text-gray-900 shadow font-semibold"
                    : "hover:bg-yellow-200 text-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-30"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 relative">
        {/* Hamburger for mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute -top-10 left-0 md:hidden text-2xl text-gray-700 mb-4"
        >
          <FaBars />
        </button>
        {renderContent()}
      </main>
    </div>
  );
};

export default Profile;
