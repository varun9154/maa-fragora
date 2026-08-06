"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}

export default function MobileMenu({
  open,
  onClose,
  links,
}: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-[999] transition-all duration-300 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* Background Overlay */}

      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Drawer */}

      <div
        className={`absolute right-0 top-0 h-full w-[320px] bg-[#050505] border-l border-white/10 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/10 p-6">

          <h2 className="text-2xl font-bold text-[#D4AF37]">
            Menu
          </h2>

          <button onClick={onClose}>
            <X
              size={28}
              className="text-white"
            />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex flex-col p-6">

          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className="border-b border-white/10 py-5 text-lg text-gray-300 transition hover:text-[#D4AF37]"
            >
              {link.name}
            </Link>
          ))}

        </nav>

        {/* Footer */}

        <div className="absolute bottom-0 w-full border-t border-white/10 p-6">

          <p className="text-center text-sm text-gray-500">
            © 2026 MAA Fragora
          </p>

        </div>

      </div>
    </div>
  );
}