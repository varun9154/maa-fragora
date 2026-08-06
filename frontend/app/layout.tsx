import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

import Providers from "@/components/providers/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MAA Fragora",
    template: "%s | MAA Fragora",
  },
  description:
    "Discover luxury perfumes from MAA Fragora. Premium fragrances crafted for every occasion.",
  keywords: [
    "Perfume",
    "Luxury Perfume",
    "MAA Fragora",
    "Fragrance",
    "Men Perfume",
    "Women Perfume",
  ],
  authors: [{ name: "Varun Kumar" }],
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
      <body
        className={`${poppins.className} bg-[#050505] text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}