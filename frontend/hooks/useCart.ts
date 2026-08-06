"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCart,
} from "@/services/cartService";

import { useCartStore } from "@/store/cartStore";

export default function useCart() {
  const queryClient = useQueryClient();

  const { setCart } = useCartStore();

  useQuery({
    queryKey: ["cart"],

    queryFn: async () => {
      const data = await getCart();

      if (data.cart) {
        const items =
          data.cart.items?.map((item: any) => ({
            id: item.productId._id,
            slug: item.productId.slug,
            name: item.productId.name,
            image: item.productId.images[0],
            price: item.productId.price,
            quantity: item.quantity,
          })) ?? [];

        setCart(items);
      }

      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addToCart(productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCart(productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) =>
      removeCartItem(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return {
    addMutation,
    updateMutation,
    removeMutation,
    clearMutation,
  };
}