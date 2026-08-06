"use client";

import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { WishlistItem as Item } from "@/store/wishlistStore";

interface WishlistItemProps {
  item: Item;
  onRemove: () => void;
}

export default function WishlistItem({
  item,
  onRemove,
}: WishlistItemProps) {
  return (
    <Card className="flex flex-col items-center text-center">

      <div className="relative h-52 w-full">

        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="300px"
          className="object-contain"
        />

      </div>

      <h2 className="mt-5 text-2xl font-semibold">
        {item.name}
      </h2>

      <p className="mt-2 text-xl font-bold text-[#D4AF37]">
        ₹{item.price}
      </p>

      <div className="mt-6 flex w-full gap-3">

        <Link
          href={`/product/${item.slug}`}
          className="flex-1"
        >
          <Button fullWidth>
            View
          </Button>
        </Link>

        <Button
          variant="danger"
          onClick={onRemove}
        >
          Remove
        </Button>

      </div>

    </Card>
  );
}