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
  | Authentication
  |--------------------------------------------------------------------------
  */

  const isAuthenticated =
    typeof window !==
      "undefined" &&
    Boolean(
      localStorage.getItem(
        "token"
      )
    );

  /*
  |--------------------------------------------------------------------------
  | GET CART
  |--------------------------------------------------------------------------
  */

  const cartQuery =
    useQuery({
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
                  "",

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

      /*
       * Only call GET /cart when
       * a token exists.
       */

      enabled:
        isAuthenticated,

      /*
       * Don't repeatedly retry a
       * failed authentication request.
       */

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
            queryKey: [
              "cart",
            ],
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
            queryKey: [
              "cart",
            ],
          }
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | REMOVE CART ITEM
  |--------------------------------------------------------------------------
  */

  const removeMutation =
    useMutation({
      mutationFn: (
        productId: string
      ) =>
        removeCartItem(
          productId
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "cart",
            ],
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
        setCart([]);

        queryClient.invalidateQueries(
          {
            queryKey: [
              "cart",
            ],
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