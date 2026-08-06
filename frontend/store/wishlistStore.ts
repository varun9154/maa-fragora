import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
}

interface WishlistStore {
  items: WishlistItem[];

  setWishlist: (items: WishlistItem[]) => void;

  addToWishlist: (item: WishlistItem) => void;

  removeFromWishlist: (id: string) => void;

  isInWishlist: (id: string) => boolean;

  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      setWishlist: (items) =>
        set({
          items,
        }),

      addToWishlist: (item) => {
        const exists = get().items.some(
          (i) => i.id === item.id
        );

        if (exists) return;

        set((state) => ({
          items: [...state.items, item],
        }));
      },

      removeFromWishlist: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== id
          ),
        })),

      isInWishlist: (id) =>
        get().items.some(
          (item) => item.id === id
        ),

      clearWishlist: () =>
        set({
          items: [],
        }),
    }),
    {
    
  name: "maa-fragora-wishlist",
  skipHydration: true,
}
  )
);