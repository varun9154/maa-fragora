"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Collections",
    href: "/collections",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link href="/" className="flex items-center gap-3">

          <Image
            src="/images/logo/logo-full.png"
            alt="MAA Fragora"
            width={50}
            height={50}
            priority
          />

          <div>

            <h1 className="text-xl font-bold text-white">
              MAA Fragora
            </h1>

            <p className="text-xs tracking-[3px] text-[#D4AF37]">
              Luxury Within Reach
            </p>

          </div>

        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-gray-300 transition hover:text-[#D4AF37]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}

        <div className="hidden items-center gap-5 lg:flex">

          <button className="transition hover:text-[#D4AF37]">
            <Search size={20} />
          </button>

          <Link href="/wishlist" className="transition hover:text-[#D4AF37]">
            <Heart size={20} />
          </Link>

          <Link href="/cart" className="transition hover:text-[#D4AF37]">
            <ShoppingCart size={20} />
          </Link>

          <Link href="/account" className="transition hover:text-[#D4AF37]">
            <User size={20} />
          </Link>

        </div>

        {/* Mobile Menu Button */}

        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#111111] lg:hidden">

          <nav className="flex flex-col p-6">

            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-white/5 py-4 text-gray-300 transition hover:text-[#D4AF37]"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/wishlist"
              className="border-b border-white/5 py-4"
            >
              Wishlist
            </Link>

            <Link
              href="/cart"
              className="border-b border-white/5 py-4"
            >
              Cart
            </Link>

            <Link
              href="/account"
              className="py-4"
            >
              Account
            </Link>

          </nav>

        </div>
      )}

    </header>
  );
}