"use client";

export default function SortDropdown() {
  return (
    <select
      className="
      rounded-full
      border
      border-white/10
      bg-[#111111]
      px-6
      py-3
      text-white
      outline-none
      focus:border-[#D4AF37]
      "
    >
      <option>Featured</option>

      <option>Newest</option>

      <option>Price : Low to High</option>

      <option>Price : High to Low</option>

      <option>Highest Rated</option>

    </select>
  );
}