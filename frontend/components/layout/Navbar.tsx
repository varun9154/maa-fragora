"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  Search,
  User,
} from "lucide-react";

import { useCartStore } from "@/store/cartStore";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}

function MobileMenu({
  open,
  onClose,
  links,
}: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
      <div className="absolute right-0 top-0 h-full w-72 bg-[#050505] p-6 shadow-xl">
        <button
          onClick={onClose}
          className="mb-8 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <nav className="flex flex-col gap-5">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-200 transition hover:text-[#D4AF37]"
              onClick={onClose}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-3xl font-bold tracking-wide"
          >
            <span className="text-[#D4AF37]">MAA</span>
            <span className="text-white">
              {" "}
              FRAGORA
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 transition hover:text-[#D4AF37]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">

            <button className="hidden md:block">
              <Search
                size={21}
                className="text-gray-300 hover:text-[#D4AF37]"
              />
            </button>

            <Link href="/wishlist">
              <Heart
                size={21}
                className="text-gray-300 hover:text-[#D4AF37]"
              />
            </Link>

            <Link href="/account">
              <User
                size={21}
                className="text-gray-300 hover:text-[#D4AF37]"
              />
            </Link>

            <Link
              href="/cart"
              className="relative"
            >
              <ShoppingBag
                size={22}
                className="text-gray-300 hover:text-[#D4AF37]"
              />

              {mounted && totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu
                size={28}
                className="text-white"
              />
            </button>

          </div>

        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        links={navLinks}
      />
    </>
  );
}