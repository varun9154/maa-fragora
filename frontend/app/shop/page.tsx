"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  Search,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

type Category =
  | "All"
  | "Men"
  | "Women"
  | "Unisex"
  | "Gift Sets";

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

export default function ShopPage() {
  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState<Category>("All");

  const [sort, setSort] =
    useState<SortOption>("featured");

  const [showFilters, setShowFilters] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useProducts({
    page: 1,
    limit: 50,
    search,
  });

  const products = data?.products || [];

  /*
   * Category + search + sorting
   *
   * We keep this on the frontend so the
   * existing backend product API does not
   * need to be changed.
   */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * Category
     */

    if (category !== "All") {
      result = result.filter(
        (product: any) => {
          const productCategory =
            String(
              product.category || ""
            ).toLowerCase();

          const productGender =
            String(
              product.gender || ""
            ).toLowerCase();

          const selected =
            category.toLowerCase();

          /*
           * Match either category or gender.
           */

          return (
            productCategory ===
              selected ||
            productGender === selected
          );
        }
      );
    }

    /*
     * Search
     */

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (product: any) => {
          const name =
            String(
              product.name || ""
            ).toLowerCase();

          const productCategory =
            String(
              product.category || ""
            ).toLowerCase();

          const description =
            String(
              product.description || ""
            ).toLowerCase();

          return (
            name.includes(searchValue) ||
            productCategory.includes(
              searchValue
            ) ||
            description.includes(
              searchValue
            )
          );
        }
      );
    }

    /*
     * Sorting
     */

    switch (sort) {
      case "price-low":
        result.sort(
          (a: any, b: any) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a: any, b: any) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );
        break;

      case "rating":
        result.sort(
          (a: any, b: any) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        );
        break;

      case "newest":
        result.sort(
          (a: any, b: any) => {
            const dateA =
              new Date(
                a.createdAt || 0
              ).getTime();

            const dateB =
              new Date(
                b.createdAt || 0
              ).getTime();

            return dateB - dateA;
          }
        );
        break;

      case "featured":
      default:
        result.sort(
          (a: any, b: any) =>
            Number(
              Boolean(b.featured)
            ) -
            Number(
              Boolean(a.featured)
            )
        );
        break;
    }

    return result;
  }, [
    products,
    category,
    search,
    sort,
  ]);

  /*
   * Loading
   */

  if (isLoading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#050505] px-6 py-20 text-white">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />

            <p className="mt-5 text-gray-400">
              Loading perfumes...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /*
   * Error
   */

  if (isError) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#050505] px-6 py-20 text-white">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-red-400">
              Unable to load products.
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black"
            >
              Try Again
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      {/* =====================================================
          EXISTING WEBSITE NAVBAR
      ===================================================== */}

      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        {/* ===================================================
            HERO / COLLECTION HEADER
        =================================================== */}

        <section className="mx-auto max-w-7xl px-6 pb-10 pt-16">

          <div className="text-center">

            <p className="uppercase tracking-[6px] text-[#D4AF37]">
              MAA Fragora
            </p>

            <h1 className="mt-4 text-5xl font-bold md:text-6xl">
              Our Collection
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
              Discover premium fragrances
              crafted for every occasion.
              Find the scent that defines you.
            </p>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="mx-auto mt-12 max-w-3xl">

            <div className="relative">

              <Search
                size={22}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search perfumes, categories or fragrances..."
                className="h-16 w-full rounded-full border border-white/10 bg-[#111111] pl-14 pr-6 text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF37]"
              />

            </div>

          </div>

          {/* =================================================
              CATEGORY BUTTONS
          ================================================= */}

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            {(
              [
                "All",
                "Men",
                "Women",
                "Unisex",
                "Gift Sets",
              ] as Category[]
            ).map((item) => (

              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={`rounded-full border px-7 py-3 text-sm font-medium transition ${
                  category === item
                    ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                    : "border-white/10 bg-[#111111] text-gray-300 hover:border-[#D4AF37]/50 hover:text-white"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </section>

        {/* ===================================================
            FILTER / SORT BAR
        =================================================== */}

        <section className="mx-auto max-w-7xl px-6">

          <div className="rounded-3xl border border-white/10 bg-[#090909] p-4">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              {/* LEFT */}

              <div className="flex flex-wrap items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(
                      (value) => !value
                    )
                  }
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111111] px-6 py-3 text-sm font-medium text-gray-300 transition hover:border-[#D4AF37]/50 hover:text-white"
                >
                  <Filter size={17} />

                  Filters

                  <ChevronDown
                    size={16}
                    className={
                      showFilters
                        ? "rotate-180 transition"
                        : "transition"
                    }
                  />
                </button>

                <span className="text-sm text-gray-500">
                  {filteredProducts.length}{" "}
                  products
                </span>

              </div>

              {/* RIGHT */}

              <div className="flex items-center gap-3">

                <span className="text-sm text-gray-500">
                  Sort by
                </span>

                <div className="relative">

                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(
                        event.target
                          .value as SortOption
                      )
                    }
                    className="h-12 appearance-none rounded-full border border-white/10 bg-[#111111] py-2 pl-5 pr-12 text-sm text-white outline-none transition focus:border-[#D4AF37]"
                  >
                    <option value="featured">
                      Featured
                    </option>

                    <option value="newest">
                      Newest
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="rating">
                      Highest Rated
                    </option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                EXPANDED FILTERS
            ================================================= */}

            {showFilters && (
              <div className="mt-4 border-t border-white/10 pt-5">

                <div className="flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setCategory("All")
                    }
                    className={`rounded-full border px-5 py-2 text-sm ${
                      category === "All"
                        ? "border-[#D4AF37] text-[#D4AF37]"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    All Products
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCategory("Men")
                    }
                    className={`rounded-full border px-5 py-2 text-sm ${
                      category === "Men"
                        ? "border-[#D4AF37] text-[#D4AF37]"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    Men's
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCategory("Women")
                    }
                    className={`rounded-full border px-5 py-2 text-sm ${
                      category === "Women"
                        ? "border-[#D4AF37] text-[#D4AF37]"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    Women's
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCategory("Unisex")
                    }
                    className={`rounded-full border px-5 py-2 text-sm ${
                      category === "Unisex"
                        ? "border-[#D4AF37] text-[#D4AF37]"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    Unisex
                  </button>

                </div>

              </div>
            )}

          </div>

        </section>

        {/* ===================================================
            PRODUCT GRID
        =================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-10">

          {filteredProducts.length === 0 ? (

            <div className="rounded-3xl border border-white/10 bg-[#111111] py-24 text-center">

              <Search
                size={40}
                className="mx-auto text-gray-600"
              />

              <h2 className="mt-5 text-2xl font-semibold">
                No perfumes found
              </h2>

              <p className="mt-2 text-gray-500">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-6 rounded-full bg-[#D4AF37] px-7 py-3 font-semibold text-black"
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map(
                (product: any) => (

                  <ProductCard
                    key={
                      product._id ||
                      product.id ||
                      product.slug
                    }
                    id={
                      product._id ||
                      String(product.id)
                    }
                    slug={product.slug}
                    name={product.name}
                    category={
                      product.category
                    }
                    description={
                      product.description ||
                      product.shortDescription ||
                      ""
                    }
                    images={
                      product.images || []
                    }
                    price={Number(
                      product.price || 0
                    )}
                    oldPrice={
                      product.oldPrice
                        ? Number(
                            product.oldPrice
                          )
                        : undefined
                    }
                    rating={Number(
                      product.rating || 0
                    )}
                    reviews={Number(
                      product.reviews || 0
                    )}
                    stock={Number(
                      product.stock || 0
                    )}
                  />

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          EXISTING WEBSITE FOOTER
      ===================================================== */}

      <Footer />
    </>
  );
}