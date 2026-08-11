import axios from "axios";

/**
 * API Base URL
 *
 * Local development:
 *   http://localhost:5000/api
 *
 * Vercel:
 *   https://maa-fragora-oqjp.vercel.app/api
 *
 * The Vercel value is provided through:
 * NEXT_PUBLIC_API_URL
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * ==========================================================
 * AUTH TOKEN
 * ==========================================================
 *
 * Adds the JWT token from localStorage to every API request.
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ==========================================================
 * RESPONSE INTERCEPTOR
 * ==========================================================
 *
 * Handles authentication failures.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Authentication required or session expired.");
    }

    return Promise.reject(error);
  }
);

export default api;