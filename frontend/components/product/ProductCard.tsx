"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
}

export default function ProductCard({
  id,
  slug,
  name,
  category,
  description,
  images,
  price,
  oldPrice,
  rating,
  reviews,
  stock,
}: ProductCardProps) {
  /*
  |--------------------------------------------------------------------------
  | DISCOUNT
  |--------------------------------------------------------------------------
  */

  const discount = oldPrice
    ? Math.round(
        ((oldPrice - price) /
          oldPrice) *
          100
      )
    : 0;

  /*
  |--------------------------------------------------------------------------
  | CART
  |--------------------------------------------------------------------------
  */

  const { addMutation } =
    useCart();

  const addToCartStore =
    useCartStore(
      (state) => state.addToCart
    );

  /*
  |--------------------------------------------------------------------------
  | WISHLIST
  |--------------------------------------------------------------------------
  */

  const {
    addMutation:
      addWishlistMutation,
    removeMutation,
  } = useWishlist();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const favourite =
    isInWishlist(id);

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const handleCart =
    async () => {
      /*
      |--------------------------------------------------------------------------
      | Check authentication
      |--------------------------------------------------------------------------
      */

      const token =
        typeof window !==
          "undefined"
          ? localStorage.getItem(
              "token"
            )
          : null;

      if (!token) {
        toast.error(
          "Please login to add items to your cart"
        );

        if (
          typeof window !==
          "undefined"
        ) {
          window.location.href =
            `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;
        }

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Stock validation
      |--------------------------------------------------------------------------
      */

      if (stock <= 0) {
        toast.error(
          "This product is out of stock"
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Prevent duplicate requests
      |--------------------------------------------------------------------------
      */

      if (addMutation.isPending) {
        return;
      }

      try {
        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |
        | Backend first.
        | Only update Zustand after backend succeeds.
        |--------------------------------------------------------------------------
        */

        await addMutation.mutateAsync(
          {
            productId: id,
            quantity: 1,
          }
        );

        /*
        |--------------------------------------------------------------------------
        | Update local cart
        |--------------------------------------------------------------------------
        */

        addToCartStore({
          id,
          slug,
          name,
          image:
            images?.[0] || "",
          price,
          quantity: 1,
        });

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        toast.success(
          `${name} added to cart`
        );
      } catch (error: any) {
        console.error(
          "Add To Cart Error:",
          error
        );

        /*
        |--------------------------------------------------------------------------
        | Authentication error
        |--------------------------------------------------------------------------
        */

        if (
          error?.response
            ?.status === 401
        ) {
          toast.error(
            "Your session has expired. Please login again."
          );

          /*
           * Remove invalid token.
           */

          localStorage.removeItem(
            "token"
          );

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Other API errors
        |--------------------------------------------------------------------------
        */

        toast.error(
          error?.response?.data
            ?.message ||
            "Unable to add product to cart"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | WISHLIST
  |--------------------------------------------------------------------------
  */

  const handleWishlist =
    async () => {
      /*
      |--------------------------------------------------------------------------
      | Check authentication
      |--------------------------------------------------------------------------
      */

      const token =
        typeof window !==
          "undefined"
          ? localStorage.getItem(
              "token"
            )
          : null;

      if (!token) {
        toast.error(
          "Please login to use wishlist"
        );

        if (
          typeof window !==
          "undefined"
        ) {
          window.location.href =
            `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;
        }

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | REMOVE FROM WISHLIST
      |--------------------------------------------------------------------------
      */

      if (favourite) {
        try {
          await removeMutation.mutateAsync(
            id
          );

          removeFromWishlist(id);

          toast.success(
            "Removed from wishlist"
          );
        } catch (error: any) {
          console.error(
            "Remove Wishlist Error:",
            error
          );

          if (
            error?.response
              ?.status === 401
          ) {
            localStorage.removeItem(
              "token"
            );

            toast.error(
              "Your session has expired. Please login again."
            );

            return;
          }

          toast.error(
            error?.response?.data
              ?.message ||
              "Unable to remove from wishlist"
          );
        }

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | ADD TO WISHLIST
      |--------------------------------------------------------------------------
      */

      try {
        await addWishlistMutation.mutateAsync(
          id
        );

        addToWishlist({
          id,
          slug,
          name,
          image:
            images?.[0] || "",
          price,
        });

        toast.success(
          "Added to wishlist"
        );
      } catch (error: any) {
        console.error(
          "Add Wishlist Error:",
          error
        );

        if (
          error?.response
            ?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          toast.error(
            "Your session has expired. Please login again."
          );

          return;
        }

        toast.error(
          error?.response?.data
            ?.message ||
            "Unable to add to wishlist"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | IMAGE
  |--------------------------------------------------------------------------
  */

  const productImage =
    images?.[0] ||
    "/placeholder.png";

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_20px_60px_rgba(212,175,55,.15)]">

      {/* ================================================================
          PRODUCT IMAGE
      ================================================================= */}

      <Link
        href={`/product/${slug}`}
      >
        <div className="relative h-80 bg-[#181818]">

          <Image
            src={productImage}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-contain p-6 transition duration-700 group-hover:scale-110"
          />

          {/* DISCOUNT */}

          {oldPrice &&
            oldPrice > price && (
              <span className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
                {discount}% OFF
              </span>
            )}

          {/* WISHLIST */}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleWishlist();
            }}
            disabled={
              addWishlistMutation.isPending ||
              removeMutation.isPending
            }
            className="absolute right-4 top-4 rounded-full bg-black/60 p-2 backdrop-blur transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={
              favourite
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <Heart
              size={20}
              className={
                favourite
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }
            />
          </button>
        </div>
      </Link>

      {/* ================================================================
          PRODUCT INFORMATION
      ================================================================= */}

      <div className="space-y-4 p-6">

        {/* CATEGORY */}

        <p className="text-xs uppercase tracking-[5px] text-[#D4AF37]">
          {category}
        </p>

        {/* NAME */}

        <Link
          href={`/product/${slug}`}
        >
          <h2 className="text-2xl font-bold transition hover:text-[#D4AF37]">
            {name}
          </h2>
        </Link>

        {/* DESCRIPTION */}

        <p className="line-clamp-2 text-sm text-gray-400">
          {description}
        </p>

        {/* RATING */}

        <div className="flex items-center gap-2">

          <Star
            size={18}
            fill="currentColor"
            className="text-[#D4AF37]"
          />

          <span>
            {rating}
          </span>

          <span className="text-gray-500">
            ({reviews})
          </span>
        </div>

        {/* PRICE */}

        <div className="flex items-center gap-3">

          <span className="text-2xl font-bold text-[#D4AF37]">
            ₹{price}
          </span>

          {oldPrice &&
            oldPrice > price && (
              <span className="text-gray-500 line-through">
                ₹{oldPrice}
              </span>
            )}
        </div>

        {/* STOCK */}

        <div className="text-sm">

          {stock > 0 ? (
            <span className="text-green-500">
              In Stock
            </span>
          ) : (
            <span className="text-red-500">
              Out of Stock
            </span>
          )}
        </div>

        {/* ================================================================
            ACTION BUTTONS
        ================================================================= */}

        <div className="flex gap-3 pt-2">

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={handleCart}
            disabled={
              stock === 0 ||
              addMutation.isPending
            }
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-semibold transition duration-300 ${
              stock > 0 &&
              !addMutation.isPending
                ? "bg-[#D4AF37] text-black hover:scale-105"
                : "cursor-not-allowed bg-gray-700 text-gray-400"
            }`}
          >

            <ShoppingCart
              size={18}
            />

            {addMutation.isPending
              ? "Adding..."
              : "Add To Cart"}
          </button>

          {/* VIEW PRODUCT */}

          <Link
            href={`/product/${slug}`}
            className="flex-1"
          >
            <button
              type="button"
              className="w-full rounded-full border border-[#D4AF37] py-3 font-semibold text-[#D4AF37] transition duration-300 hover:bg-[#D4AF37] hover:text-black"
            >
              View
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}