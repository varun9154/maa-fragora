import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  turbopack: {
    root: __dirname,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://maa-fragora.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;