import api from "./axiosInstance";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Token inject automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Default export
export default api;

// 🔹 Alias export (old axios code bhi chalega)
export { api as axios };
