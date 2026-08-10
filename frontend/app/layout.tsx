import type { Metadata } from "next";
import "./globals.css";

import Providers from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "MAA Fragora | Luxury Perfumes",

  description:
    "Experience luxury perfumes crafted for confidence, elegance and unforgettable impressions.",

  keywords: [
    "Perfume",
    "Luxury Perfume",
    "Fragrance",
    "Maa Fragora",
    "Eau De Parfum",
    "Premium Perfumes",
  ],

  authors: [
    {
      name: "Varun Kumar",
    },
  ],

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">
        <Providers>
          {children}

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,

              style: {
                background: "#111111",
                color: "#ffffff",
                border: "1px solid #D4AF37",
                borderRadius: "14px",
                padding: "14px 18px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  "0 15px 40px rgba(0, 0, 0, 0.45)",
              },

              success: {
                iconTheme: {
                  primary: "#D4AF37",
                  secondary: "#000000",
                },
              },

              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}