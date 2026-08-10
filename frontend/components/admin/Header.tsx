"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#111111] px-8">

      <div>

        <h2 className="text-2xl font-bold">

          Admin Dashboard

        </h2>

      </div>

      <div className="flex items-center gap-6">

        <Bell className="cursor-pointer text-gray-400 hover:text-[#D4AF37]" />

        <UserCircle
          size={34}
          className="cursor-pointer text-[#D4AF37]"
        />

      </div>

    </header>
  );
}