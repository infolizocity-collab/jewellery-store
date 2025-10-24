// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//   withCredentials: true,
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;

