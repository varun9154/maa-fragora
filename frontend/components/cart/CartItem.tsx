"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Price from "@/components/ui/Price";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { CartItem as CartItemType } from "@/store/cartStore";

interface CartItemProps {
  item: CartItemType;

  onIncrease: () => void;

  onDecrease: () => void;

  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <Card className="flex flex-col gap-6 md:flex-row md:items-center">

      {/* Product Image */}

      <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-[#181818]">

        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="128px"
          className="object-contain p-3"
        />

      </div>

      {/* Product Info */}

      <div className="flex-1">

        <h2 className="text-2xl font-semibold">
          {item.name}
        </h2>

        <p className="mt-2 text-gray-400">
          Premium Luxury Perfume
        </p>

        <div className="mt-4">
          <Price
            price={item.price}
          />
        </div>

      </div>

      {/* Quantity */}

      <div className="flex flex-col items-center gap-5">

        <QuantitySelector
          quantity={item.quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />

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