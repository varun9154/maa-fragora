"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";

type ProductCardProps = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
};

export default function ProductCard({
  slug,
  name,
  category,
  description,
  image,
  price,
  oldPrice,
  rating,
  reviews,
}: ProductCardProps) {
  const discount = Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_20px_60px_rgba(212,175,55,0.18)]">
      
      <Link href={`/product/${slug}`}>
        <div className="relative h-80 overflow-hidden bg-[#181818]">

          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-6 transition duration-700 group-hover:scale-110"
          />

          <span className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
            {discount}% OFF
          </span>

          <button className="absolute right-4 top-4 rounded-full bg-black/60 p-2 backdrop-blur transition hover:text-[#D4AF37]">
            <Heart size={18} />
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

        <p className="text-sm text-gray-400">
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
            ({reviews} Reviews)
          </span>

        </div>

        <div className="flex items-center gap-4">

          <span className="text-2xl font-bold text-[#D4AF37]">
            ₹{price}
          </span>

          <span className="text-gray-500 line-through">
            ₹{oldPrice}
          </span>

        </div>

        <div className="flex gap-3">

          <button className="flex-1 rounded-full bg-[#D4AF37] py-3 font-semibold text-black transition hover:scale-105">
            Buy Now
          </button>

          <button className="rounded-full border border-[#D4AF37] p-3 transition hover:bg-[#D4AF37] hover:text-black">
            <ShoppingCart size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}