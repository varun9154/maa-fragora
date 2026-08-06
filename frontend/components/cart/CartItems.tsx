"use client";

import CartItem from "./CartItem";
import { useCartStore } from "@/store/cartStore";

export default function CartItems() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={() => increaseQuantity(item.id)}
          onDecrease={() => decreaseQuantity(item.id)}
          onRemove={() => removeFromCart(item.id)}
        />
      ))}
    </div>
  );
}