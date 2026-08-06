"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";

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
  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const { addMutation } = useCart();

  const {
    addMutation: addWishlistMutation,
    removeMutation,
  } = useWishlist();

  const addToCartStore = useCartStore(
    (state) => state.addToCart
  );

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const favourite = isInWishlist(id);

  const handleCart = async () => {
    addToCartStore({
      id,
      slug,
      name,
      image: images[0],
      price,
      quantity: 1,
    });

    try {
      await addMutation.mutateAsync({
        productId: id,
        quantity: 1,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleWishlist = async () => {
    if (favourite) {
      removeFromWishlist(id);

      try {
        await removeMutation.mutateAsync(id);
      } catch (error) {
        console.error(error);
      }

      return;
    }

    addToWishlist({
      id,
      slug,
      name,
      image: images[0],
      price,
    });

    try {
      await addWishlistMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_20px_60px_rgba(212,175,55,.15)]">
      <Link href={`/product/${slug}`}>
        <div className="relative h-80 bg-[#181818]">
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
            className="object-contain p-6 transition duration-700 group-hover:scale-110"
          />

          {oldPrice && (
            <span className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
              {discount}% OFF
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlist();
            }}
            className="absolute right-4 top-4 rounded-full bg-black/60 p-2 backdrop-blur transition hover:scale-110"
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

      <div className="space-y-4 p-6">
        <p className="text-xs uppercase tracking-[5px] text-[#D4AF37]">
          {category}
        </p>

        <Link href={`/product/${slug}`}>
          <h2 className="text-2xl font-bold transition hover:text-[#D4AF37]">
            {name}
          </h2>
        </Link>

        <p className="line-clamp-2 text-sm text-gray-400">
          {description}
        </p>

        <div className="flex items-center gap-2">
          <Star
            size={18}
            fill="currentColor"
            className="text-[#D4AF37]"
          />

          <span>{rating}</span>

          <span className="text-gray-500">
            ({reviews})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[#D4AF37]">
            ₹{price}
          </span>

          {oldPrice && (
            <span className="text-gray-500 line-through">
              ₹{oldPrice}
            </span>
          )}
        </div>

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

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCart}
            disabled={stock === 0}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-semibold transition duration-300 ${
              stock > 0
                ? "bg-[#D4AF37] text-black hover:scale-105"
                : "cursor-not-allowed bg-gray-700 text-gray-400"
            }`}
          >
            <ShoppingCart size={18} />
            Add To Cart
          </button>

          <Link
            href={`/product/${slug}`}
            className="flex-1"
          >
            <button className="w-full rounded-full border border-[#D4AF37] py-3 font-semibold text-[#D4AF37] transition duration-300 hover:bg-[#D4AF37] hover:text-black">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}