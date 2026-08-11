import axios from "axios";

const api = axios.create({
  // In production Vercel will route /api/* to the backend service.
  // Locally it will use http://localhost:5000/api unless
  // NEXT_PUBLIC_API_URL is provided.
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

/* ======================================================
   AUTH TOKEN
====================================================== */

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;