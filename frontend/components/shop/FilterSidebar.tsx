"use client";

import { SlidersHorizontal } from "lucide-react";

export default function FilterSidebar() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <div className="flex items-center gap-3">

        <SlidersHorizontal
          className="text-[#D4AF37]"
          size={22}
        />

        <h2 className="text-2xl font-semibold">
          Filters
        </h2>

      </div>

      <div className="mt-8">

        <h3 className="mb-4 font-semibold text-[#D4AF37]">
          Price Range
        </h3>

        <input
          type="range"
          min="500"
          max="3000"
          defaultValue="3000"
          className="w-full accent-[#D4AF37]"
        />

        <div className="mt-3 flex justify-between text-sm text-gray-400">
          <span>₹500</span>
          <span>₹3000</span>
        </div>

      </div>

      <div className="mt-10">

        <h3 className="mb-4 font-semibold text-[#D4AF37]">
          Gender
        </h3>

        <div className="space-y-3">

          <label className="flex gap-3">
            <input type="checkbox" />
            Men
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            Women
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            Unisex
          </label>

        </div>

      </div>

      <div className="mt-10">

        <h3 className="mb-4 font-semibold text-[#D4AF37]">
          Rating
        </h3>

        <div className="space-y-3">

          <label className="flex gap-3">
            <input type="checkbox" />
            ★★★★★
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            ★★★★☆
          </label>

          <label className="flex gap-3">
            <input type="checkbox" />
            ★★★☆☆
          </label>

        </div>

      </div>

      <div className="mt-10">

        <button
          className="
          w-full
          rounded-full
          bg-[#D4AF37]
          py-3
          font-semibold
          text-black
          transition
          hover:scale-105
          "
        >
          Apply Filters
        </button>

      </div>

    </aside>
  );
}