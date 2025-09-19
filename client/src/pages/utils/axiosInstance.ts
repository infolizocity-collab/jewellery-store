import axios from "axios";  // ✅ axios ko import karo, api ko nahi

// ✅ Ek instance banao
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

// ✅ Default export
export default api;

// ✅ Alias export (agar kahin tum "axios" use karna chaho)
export { api as axios };
