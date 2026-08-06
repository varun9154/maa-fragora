"use client";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  "All",
  "Signature",
  "Luxury",
  "Fresh",
  "Oud",
  "Limited",
];

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
}: FilterSidebarProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Categories
      </h2>

      <div className="space-y-3">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`w-full rounded-xl px-4 py-3 text-left font-medium transition ${
              selectedCategory === category
                ? "bg-[#D4AF37] text-black"
                : "bg-[#181818] text-white hover:bg-[#D4AF37] hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

      <div className="mt-8 border-t border-white/10 pt-6">

        <h3 className="mb-4 text-lg font-semibold text-white">
          Why MAA Fragora?
        </h3>

        <ul className="space-y-2 text-sm text-gray-400">
          <li>✔ Premium Quality</li>
          <li>✔ Long Lasting</li>
          <li>✔ Luxury Packaging</li>
          <li>✔ Fast Delivery</li>
        </ul>

      </div>

    </aside>
  );
}