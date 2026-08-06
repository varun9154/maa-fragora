"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full">

      <Search
        size={20}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search perfumes..."
        className="
          w-full
          rounded-full
          border
          border-white/10
          bg-[#111111]
          py-4
          pl-14
          pr-6
          text-white
          outline-none
          transition
          duration-300
          focus:border-[#D4AF37]
          focus:ring-2
          focus:ring-[#D4AF37]/20
        "
      />

    </div>
  );
}