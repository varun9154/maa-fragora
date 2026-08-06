"use client";

import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import SearchBar from "@/components/shop/SearchBar";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";

export default function ShopPage() {
  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        {/* Hero */}

        <section className="border-b border-white/10 py-20">

          <div className="mx-auto max-w-7xl px-6">

            <h1 className="text-5xl font-bold">
              Luxury Perfumes
            </h1>

            <p className="mt-4 max-w-2xl text-gray-400">
              Discover premium fragrances crafted for elegance,
              confidence and unforgettable moments.
            </p>

          </div>

        </section>

        {/* Search */}

        <section className="mx-auto max-w-7xl px-6 pt-10">

          <SearchBar
            value={search}
            onChange={setSearch}
          />

        </section>

        {/* Products */}

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[260px_1fr]">

          <FilterSidebar
            selectedCategory={category}
            onCategoryChange={setCategory}
          />

          <ProductGrid
            search={search}
            category={category}
          />

        </section>

      </main>

      <Footer />
    </>
  );
}