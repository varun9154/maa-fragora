import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type":
      "application/json",
  },

  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Automatically attach JWT token
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    if (
      typeof window !==
      "undefined"
    ) {
      const token =
        localStorage.getItem(
          "token"
        );

      if (token) {
        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(
      error
    );
  }
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status =
      error?.response?.status;

    /*
     * Authentication error
     *
     * IMPORTANT:
     * Do not console.error here because
     * Next.js development mode can show
     * the red error overlay.
     */

    if (status === 401) {
      console.warn(
        "API Authentication Error:",
        error?.response?.data
      );

      /*
       * Do NOT immediately remove the token.
       *
       * We need to inspect the backend
       * authentication problem first.
       */

      return Promise.reject(
        error
      );
    }

    /*
     * Other API errors
     */

    console.warn(
      "API Error:",
      error?.response?.data ||
        error?.message
    );

    return Promise.reject(
      error
    );
  }
);

export default api;