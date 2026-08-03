import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import SearchBar from "@/components/shop/SearchBar";
import CategoryFilter from "@/components/shop/CategoryFilter";
import SortDropdown from "@/components/shop/SortDropdown";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">

          <p className="tracking-[8px] uppercase text-[#D4AF37]">
            MAA FRAGORA
          </p>

          <h1 className="mt-4 text-6xl font-bold">
            Luxury Collection
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-gray-400">
            Explore our exclusive collection of premium fragrances
            crafted for every occasion.
          </p>

        </div>

        <div className="mt-12">
          <SearchBar />
        </div>

        <div className="mt-8">
          <CategoryFilter />
        </div>

        <div className="mt-8 flex justify-end">
          <SortDropdown />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">

          <FilterSidebar />

          <ProductGrid />

        </div>

      </section>

      <Footer />

    </main>
  );
}