// src/utils/axiosInstance.ts
import axios from "axios";

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

// 🔹 Alias export (agar kahin purane code me axios likha hai)
export { api as axios };
