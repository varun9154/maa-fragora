"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "@/services/wishlistService";

import { useWishlistStore } from "@/store/wishlistStore";

export default function useWishlist() {
  const queryClient = useQueryClient();

  const { setWishlist } = useWishlistStore();

  useQuery({
    queryKey: ["wishlist"],

    queryFn: async () => {
      const data = await getWishlist();
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (productId: string) =>
      addWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) =>
      removeWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  return {
    addMutation,
    removeMutation,
  };
}