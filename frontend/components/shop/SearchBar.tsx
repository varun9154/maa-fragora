"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative">

      <Search
        size={22}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]"
      />

      <input
        type="text"
        placeholder="Search perfumes..."
        className="
        w-full
        rounded-full
        border
        border-white/10
        bg-[#111111]
        py-4
        pl-14
        pr-5
        text-white
        outline-none
        transition
        focus:border-[#D4AF37]
        "
      />

    </div>
  );
}