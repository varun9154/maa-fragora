import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartStore {
  cart: any;
  items: CartItem[];

  setCart: (items: CartItem[]) => void;

  addToCart: (item: CartItem) => void;

  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;

  clearCart: () => void;

  totalItems: () => number;

  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cart: null,

      setCart: (items) =>
        set({
          items,
          cart: items,
        }),

      addToCart: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: i.quantity + 1,
                    }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== id
          ),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () =>
        set({
          items: [],
        }),

      totalItems: () =>
        get().items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) =>
            sum + item.price * item.quantity,
          0
        ),
    }),
    {
  name: "maa-fragora-cart",
  skipHydration: true,
}
  )
);