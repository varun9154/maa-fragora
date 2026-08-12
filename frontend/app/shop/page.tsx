"use client";

import { useState } from "react";

import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";

import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
  const [search, setSearch] =
    useState("");

  const {
    data,
    isLoading,
    isError,
  } = useProducts({
    page: 1,
    limit: 50,
    search,
  });

  const products =
    data?.products || [];

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

            <p className="text-gray-400">
              Loading perfumes...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (isError) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              Unable to load products
            </h1>

            <p className="mt-3 text-gray-500">
              Please try refreshing the
              page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          SHOP HERO
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-20 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[7px] text-[#D4AF37]">
            MAA FRAGORA
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
            Our Collection
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400">
            Discover premium fragrances
            crafted for every occasion.
            Find the scent that defines
            you.
          </p>
        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search perfumes, categories or fragrances..."
              className="w-full rounded-full border border-white/10 bg-[#111111] px-6 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#111111] py-24 text-center">
            <h2 className="text-2xl font-semibold">
              No perfumes found
            </h2>

            <p className="mt-3 text-gray-500">
              Try another search.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(
              (product: any) => (
                <ProductCard
                  key={
                    String(product.id || product._id || product.slug)
                  }
                  id={
                    String(product.id || product._id || product.slug)
                  }
                  slug={
                    product.slug
                  }
                  name={
                    product.name
                  }
                  category={
                    product.category
                  }
                  description={
                    product.description
                  }
                  images={
                    product.images ||
                    []
                  }
                  price={
                    Number(
                      product.price
                    )
                  }
                  oldPrice={
                    product.oldPrice
                  }
                  rating={
                    Number(
                      product.rating ||
                        0
                    )
                  }
                  reviews={
                    Number(
                      product.reviews ||
                        0
                    )
                  }
                  stock={
                    Number(
                      product.stock ||
                        0
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}