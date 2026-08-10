"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCart,
} from "@/services/cartService";

import { useCartStore } from "@/store/cartStore";

export default function useCart() {
  const queryClient =
    useQueryClient();

  const { setCart } =
    useCartStore();

  /*
  |--------------------------------------------------------------------------
  | GET CART
  |--------------------------------------------------------------------------
  */

  const cartQuery = useQuery({
    queryKey: ["cart"],

    queryFn: async () => {
      const data =
        await getCart();

      if (data?.cart) {
        const items =
          data.cart.items?.map(
            (item: any) => ({
              id:
                item.productId?._id,

              slug:
                item.productId?.slug,

              name:
                item.productId?.name,

              image:
                item.productId
                  ?.images?.[0] ||
                "/images/placeholder.jpg",

              price:
                Number(
                  item.productId
                    ?.price || 0
                ),

              quantity:
                Number(
                  item.quantity || 1
                ),
            })
          ) ?? [];

        setCart(items);
      }

      return data;
    },

    retry: false,
  });

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const addMutation =
    useMutation({
      mutationFn: ({
        productId,
        quantity,
      }: {
        productId: string;
        quantity: number;
      }) =>
        addToCart(
          productId,
          quantity
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: ["cart"],
          }
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | UPDATE CART
  |--------------------------------------------------------------------------
  */

  const updateMutation =
    useMutation({
      mutationFn: ({
        productId,
        quantity,
      }: {
        productId: string;
        quantity: number;
      }) =>
        updateCart(
          productId,
          quantity
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: ["cart"],
          }
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | REMOVE ITEM
  |--------------------------------------------------------------------------
  */

  const removeMutation =
    useMutation({
      mutationFn: (
        productId: string
      ) =>
        removeCartItem(productId),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: ["cart"],
          }
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | CLEAR CART
  |--------------------------------------------------------------------------
  */

  const clearMutation =
    useMutation({
      mutationFn:
        clearCart,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: ["cart"],
          }
        );
      },
    });

  return {
    cartQuery,

    addMutation,

    updateMutation,

    removeMutation,

    clearMutation,
  };
}