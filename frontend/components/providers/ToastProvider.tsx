"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        duration: 3500,

        style: {
          background: "#111111",
          color: "#ffffff",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: "16px",
          padding: "14px 18px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        },

        success: {
          duration: 3000,

          iconTheme: {
            primary: "#D4AF37",
            secondary: "#111111",
          },
        },

        error: {
          duration: 4000,

          iconTheme: {
            primary: "#ef4444",
            secondary: "#111111",
          },
        },
      }}
    />
  );
}