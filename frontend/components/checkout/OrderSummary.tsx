"use client";

import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Truck,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import useOrders from "@/hooks/useOrders";
import { useCartStore } from "@/store/cartStore";
import useHydration from "@/hooks/useHydration";

interface OrderSummaryProps {
  shipping?: number;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function OrderSummary({
  shipping = 0,
}: OrderSummaryProps) {
  const router = useRouter();

  const hydrated = useHydration();

  /*
   * Order mutation
   */
  const { placeOrderMutation } =
    useOrders();

  /*
   * Cart
   */
  const rawItems = useCartStore(
    (state) => state.items
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  /*
   * Make sure cart is always an array
   */
  const items: CartItem[] = Array.isArray(
    rawItems
  )
    ? (rawItems as CartItem[])
    : [];

  const [loading, setLoading] =
    useState(false);

  /* ==========================================================
     HYDRATION
  ========================================================== */

  if (!hydrated) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 text-white">

        <div className="mb-8 h-8 w-56 animate-pulse rounded bg-gray-800" />

        <div className="space-y-5">

          <div className="h-16 animate-pulse rounded bg-gray-800" />

          <div className="h-16 animate-pulse rounded bg-gray-800" />

          <div className="h-16 animate-pulse rounded bg-gray-800" />

        </div>

      </div>
    );
  }

  /* ==========================================================
     TOTAL ITEMS
  ========================================================== */

  const totalItems = items.reduce(
    (
      sum: number,
      item: CartItem
    ): number => {
      return (
        sum +
        Number(item.quantity)
      );
    },
    0
  );

  /* ==========================================================
     SUBTOTAL
  ========================================================== */

  const subtotal = items.reduce(
    (
      sum: number,
      item: CartItem
    ): number => {
      return (
        sum +
        Number(item.price) *
          Number(item.quantity)
      );
    },
    0
  );

  /* ==========================================================
     DISCOUNT
  ========================================================== */

  const discount =
    subtotal >= 3000 ? 200 : 0;

  /* ==========================================================
     GRAND TOTAL
  ========================================================== */

  const grandTotal =
    subtotal +
    Number(shipping) -
    discount;

  /* ==========================================================
     PLACE ORDER
  ========================================================== */

  const handlePlaceOrder =
    async (): Promise<void> => {
      if (items.length === 0) {
        alert(
          "Your cart is empty."
        );

        return;
      }

      setLoading(true);

      try {
        /*
         * Convert cart items into
         * backend order items.
         */
        const orderItems = items.map(
          (item: CartItem) => ({
            productId: item.id,
            name: item.name,
            image: item.image,
            quantity: Number(
              item.quantity
            ),
            price: Number(
              item.price
            ),
          })
        );

        /*
         * IMPORTANT:
         *
         * DO NOT SEND userId HERE.
         *
         * Backend gets userId from
         * authentication middleware.
         */
        const response =
          await placeOrderMutation.mutateAsync(
            {
              items: orderItems,

              totalAmount:
                grandTotal,

              shippingAddress: {
                fullName:
                  "Customer",

                phone:
                  "9999999999",

                address:
                  "Address",

                city:
                  "City",

                state:
                  "State",

                pincode:
                  "000000",
              },

              paymentMethod:
                "COD",
            }
          );

        /*
         * Check response
         */
        if (
          !response ||
          response.success !== true
        ) {
          throw new Error(
            response?.message ||
              "Unable to place order"
          );
        }

        /*
         * Clear local cart
         */
        clearCart();

        /*
         * Order ID
         */
        const orderId =
          response?.order?._id;

        /*
         * Redirect
         */
        if (orderId) {
          router.push(
            `/order-success?orderId=${orderId}`
          );
        } else {
          router.push(
            "/order-success"
          );
        }
      } catch (error: unknown) {
        console.error(
          "Place Order Error:",
          error
        );

        let message =
          "Unable to place order.";

        if (
          error instanceof Error
        ) {
          message =
            error.message;
        }

        /*
         * Axios error response
         */
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError =
            error as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            };

          message =
            axiosError.response?.data
              ?.message ||
            message;
        }

        alert(message);
      } finally {
        setLoading(false);
      }
    };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex items-center gap-3">

        <ShoppingBag
          className="text-[#D4AF37]"
          size={30}
        />

        <h2 className="text-3xl font-bold">
          Order Summary
        </h2>

      </div>

      {/* =====================================================
          CART ITEMS
      ===================================================== */}

      <div className="space-y-5">

        {items.length === 0 && (
          <p className="text-center text-gray-400">
            Your cart is empty.
          </p>
        )}

        {items.map(
          (item: CartItem) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-white/10 pb-4"
            >

              <div className="flex items-center gap-4">

                {/* PRODUCT IMAGE */}

                <div className="h-16 w-16 overflow-hidden rounded-xl bg-[#181818]">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-2"
                  />

                </div>

                {/* PRODUCT INFO */}

                <div>

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Qty:{" "}
                    {item.quantity}
                  </p>

                </div>

              </div>

              {/* PRICE */}

              <span className="font-semibold text-[#D4AF37]">
                ₹
                {Number(
                  item.price
                ) *
                  Number(
                    item.quantity
                  )}
              </span>

            </div>
          )
        )}

      </div>

      {/* =====================================================
          TOTALS
      ===================================================== */}

      <div className="mt-8 space-y-5">

        {/* TOTAL ITEMS */}

        <div className="flex justify-between">

          <span className="text-gray-400">
            Total Items
          </span>

          <span>
            {totalItems}
          </span>

        </div>

        {/* SUBTOTAL */}

        <div className="flex justify-between">

          <span className="text-gray-400">
            Subtotal
          </span>

          <span>
            ₹{subtotal}
          </span>

        </div>

        {/* SHIPPING */}

        <div className="flex justify-between">

          <div className="flex items-center gap-2">

            <Truck size={18} />

            <span className="text-gray-400">
              Shipping
            </span>

          </div>

          <span>
            {shipping === 0
              ? "FREE"
              : `₹${shipping}`}
          </span>

        </div>

        {/* DISCOUNT */}

        <div className="flex justify-between">

          <div className="flex items-center gap-2">

            <Tag size={18} />

            <span className="text-gray-400">
              Discount
            </span>

          </div>

          <span className="text-green-400">
            -₹{discount}
          </span>

        </div>

        {/* GRAND TOTAL */}

        <div className="border-t border-white/10 pt-6">

          <div className="flex justify-between text-2xl font-bold">

            <span>
              Total
            </span>

            <span className="text-[#D4AF37]">
              ₹{grandTotal}
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          PLACE ORDER BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={
          loading ||
          items.length === 0
        }
        className={`mt-8 w-full rounded-full py-4 text-lg font-bold transition duration-300 ${
          loading ||
          items.length === 0
            ? "cursor-not-allowed bg-gray-700 text-gray-400"
            : "bg-[#D4AF37] text-black hover:scale-105"
        }`}
      >
        {loading
          ? "Placing Order..."
          : "Place Order"}
      </button>

      {/* =====================================================
          SECURITY
      ===================================================== */}

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-400">

        <ShieldCheck size={18} />

        <span>
          Secure Checkout • SSL Protected
        </span>

      </div>

    </div>
  );
}