"use client";

import WishlistItem from "./WishlistItem";
import EmptyWishlist from "./EmptyWishlist";

import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistGrid() {
  const { items, removeFromWishlist } = useWishlistStore();

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <WishlistItem
          key={item.id}
          item={item}
          onRemove={() => removeFromWishlist(item.id)}
        />
      ))}
    </div>
  );
}