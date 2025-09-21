import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axiosInstance";

// 🔹 Order type
interface Order {
  _id: string;
  total: number;
  status: string;
}

// 🔹 Profile picture upload response type
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

  if (!auth) return null;
  const { user, logout, updateProfile } = auth;

  // ✅ Fetch orders when tab is active
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

      updateProfile(res.data.user); // ✅ Type-safe now
      setPreview(null);
      alert("Profile picture updated!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err?.response?.data?.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-3">
          {[
            { key: "profile", label: "👤 My Profile" },
            { key: "orders", label: "📦 My Orders" },
            { key: "wishlist", label: "❤️ Wishlist" },
            { key: "addresses", label: "🏠 Saved Addresses" },
            { key: "password", label: "🔑 Change Password" },
            { key: "logout", label: "🚪 Logout" },
          ].map((item) => (
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

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">👤 Profile Info</h2>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                ) : user?.profilePic ? (
                  <img src={user.profilePic} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🙂</span>
                )}
              </div>

              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>

                <form onSubmit={handleUpload} className="mt-3 flex items-center gap-3">
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
                    className="px-3 py-2 border rounded cursor-pointer hover:bg-yellow-100"
                  >
                    Choose Image
                  </label>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  Max 5MB. JPG / PNG recommended.
                </p>
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
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>
            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order._id} className="border p-4 rounded-lg shadow-sm">
                    <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                    <p><span className="font-semibold">Total:</span> ₹{order.total}</p>
                    <p>
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
        )}

        {activeTab === "wishlist" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">❤️ Wishlist</h2>
            <p>Wishlist items will appear here.</p>
          </div>
        )}
        {activeTab === "addresses" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏠 Saved Addresses</h2>
            <p>Manage addresses here.</p>
          </div>
        )}
        {activeTab === "password" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🔑 Change Password</h2>
            <p>Change password form will go here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;