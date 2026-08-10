"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";

import { products } from "@/data/products";

import {
  ShoppingCart,
  Zap,
} from "lucide-react";

import toast from "react-hot-toast";

import useCart from "@/hooks/useCart";
import { useCartStore } from "@/store/cartStore";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const product =
    products.find(
      (item) =>
        item.slug === slug
    );

  if (!product) {
    return null;
  }

  return (
    <ProductPageContent
      product={product}
    />
  );
}

function ProductPageContent({
  product,
}: {
  product: any;
}) {
  const router =
    useRouter();

  const {
    addMutation,
  } = useCart();

  const addToCartStore =
    useCartStore(
      (state) =>
        state.addToCart
    );

  const [
    adding,
    setAdding,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const handleAddToCart =
    async () => {
      if (
        product.stock <= 0
      ) {
        toast.error(
          "This product is out of stock."
        );

        return;
      }

      if (adding) {
        return;
      }

      try {
        setAdding(true);

        await addMutation.mutateAsync(
          {
            productId:
              product._id ||
              product.id,
            quantity: 1,
          }
        );

        addToCartStore({
          id:
            product._id ||
            product.id,
          slug:
            product.slug,
          name:
            product.name,
          image:
            product.images?.[0],
          price:
            product.price,
          quantity: 1,
        });

        toast.success(
          `${product.name} added to cart`
        );

      } catch (error: any) {

        console.error(
          "Add To Cart Error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to add product to cart."
        );

      } finally {
        setAdding(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | BUY NOW
  |--------------------------------------------------------------------------
  */

  const handleBuyNow =
    async () => {
      await handleAddToCart();

      router.push(
        "/cart"
      );
    };

  const galleryImages = [
    ...product.images,
    ...product.images,
    ...product.images,
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid gap-16 lg:grid-cols-2">

            {/* =================================================
                GALLERY
            ================================================= */}

            <ProductGallery
              images={
                galleryImages
              }
              name={
                product.name
              }
            />

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div>

              <p className="uppercase tracking-[6px] text-[#D4AF37]">
                {product.category}
              </p>

              <h1 className="mt-4 text-5xl font-bold">
                {product.name}
              </h1>

              {/* RATING */}

              <div className="mt-5 flex items-center gap-3">

                <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-sm font-semibold text-black">
                  ⭐ {product.rating}
                </span>

                <span className="text-gray-400">
                  {product.reviews} Reviews
                </span>

              </div>

              {/* DESCRIPTION */}

              <p className="mt-8 leading-8 text-gray-400">
                {product.description}
              </p>

              {/* PRICE */}

              <div className="mt-10 flex items-center gap-5">

                <span className="text-5xl font-bold text-[#D4AF37]">
                  ₹{product.price}
                </span>

                {product.oldPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.oldPrice}
                  </span>
                )}

              </div>

              {/* PRODUCT DETAILS */}

              <div className="mt-10 rounded-3xl border border-white/10 bg-[#111111] p-8">

                <h2 className="text-2xl font-semibold">
                  Product Details
                </h2>

                <div className="mt-6 space-y-4">

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Stock
                    </span>

                    <span>
                      {product.stock} Available
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Category
                    </span>

                    <span>
                      {product.category}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Rating
                    </span>

                    <span>
                      {product.rating}/5
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="mt-10 flex gap-4">

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    product.stock <= 0 ||
                    adding
                  }
                  className={`flex flex-1 items-center justify-center gap-3 rounded-full py-4 text-lg font-semibold transition ${
                    product.stock > 0 &&
                    !adding
                      ? "bg-[#D4AF37] text-black hover:scale-105"
                      : "cursor-not-allowed bg-gray-700 text-gray-400"
                  }`}
                >

                  <ShoppingCart
                    size={20}
                  />

                  {adding
                    ? "Adding..."
                    : "Add To Cart"}

                </button>

                <button
                  type="button"
                  onClick={
                    handleBuyNow
                  }
                  disabled={
                    product.stock <= 0 ||
                    adding
                  }
                  className="flex items-center gap-3 rounded-full border border-[#D4AF37] px-8 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                >

                  <Zap
                    size={20}
                  />

                  Buy Now

                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}