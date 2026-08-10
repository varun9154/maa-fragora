"use client";

import {
  FormEvent,
  ChangeEvent,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import {
  MapPin,
  Phone,
  User,
} from "lucide-react";

import useCart from "@/hooks/useCart";
import { createOrder } from "@/services/orderService";
import { useCartStore } from "@/store/cartStore";

/* ==========================================================
   CART ITEM TYPE
========================================================== */

interface CheckoutCartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

/* ==========================================================
   FORM TYPE
========================================================== */

interface CheckoutForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

/* ==========================================================
   CHECKOUT PAGE
========================================================== */

export default function CheckoutPage() {
  const router = useRouter();

  /*
   * Backend cart synchronization
   */
  const { clearMutation } = useCart();

  /*
   * Get cart from Zustand.
   *
   * The store can temporarily contain null,
   * therefore we safely convert it to [].
   */
  const rawCart = useCartStore(
    (state) => state.cart
  );

  /*
   * Explicitly tell TypeScript what
   * a checkout cart item looks like.
   */
  const cart: CheckoutCartItem[] =
    Array.isArray(rawCart)
      ? (rawCart as CheckoutCartItem[])
      : [];

  /*
   * Loading state
   */
  const [loading, setLoading] =
    useState<boolean>(false);

  /*
   * Checkout form
   */
  const [form, setForm] =
    useState<CheckoutForm>({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  /* ========================================================
     TOTAL AMOUNT
  ======================================================== */

  const totalAmount = useMemo<number>(() => {
    return cart.reduce(
      (
        total: number,
        item: CheckoutCartItem
      ): number => {
        return (
          total +
          Number(item.price) *
            Number(item.quantity)
        );
      },
      0
    );
  }, [cart]);

  /* ========================================================
     TOTAL ITEMS
  ======================================================== */

  const totalItems = useMemo<number>(() => {
    return cart.reduce(
      (
        total: number,
        item: CheckoutCartItem
      ): number => {
        return (
          total +
          Number(item.quantity)
        );
      },
      0
    );
  }, [cart]);

  /* ========================================================
     INPUT CHANGE
  ======================================================== */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const {
      name,
      value,
    } = e.target;

    setForm(
      (previous: CheckoutForm) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* ========================================================
     PLACE ORDER
  ======================================================== */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    /* -------------------------------------------------------
       CART VALIDATION
    ------------------------------------------------------- */

    if (cart.length === 0) {
      toast.error(
        "Your cart is empty"
      );
      return;
    }

    /* -------------------------------------------------------
       ADDRESS VALIDATION
    ------------------------------------------------------- */

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      toast.error(
        "Please fill all address fields"
      );

      return;
    }

    /* -------------------------------------------------------
       PHONE VALIDATION
    ------------------------------------------------------- */

    if (
      !/^[0-9]{10}$/.test(
        form.phone.trim()
      )
    ) {
      toast.error(
        "Enter a valid 10 digit phone number"
      );

      return;
    }

    /* -------------------------------------------------------
       PINCODE VALIDATION
    ------------------------------------------------------- */

    if (
      !/^[0-9]{6}$/.test(
        form.pincode.trim()
      )
    ) {
      toast.error(
        "Enter a valid 6 digit pincode"
      );

      return;
    }

    try {
      setLoading(true);

      /* -----------------------------------------------------
         CONVERT CART TO ORDER ITEMS
      ----------------------------------------------------- */

      const items = cart.map(
        (
          item: CheckoutCartItem
        ) => ({
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

      /* -----------------------------------------------------
         CREATE ORDER
      ----------------------------------------------------- */

      const response =
        await createOrder({
          items,

          totalAmount,

          shippingAddress: {
            fullName:
              form.fullName.trim(),

            phone:
              form.phone.trim(),

            address:
              form.address.trim(),

            city:
              form.city.trim(),

            state:
              form.state.trim(),

            pincode:
              form.pincode.trim(),
          },

          paymentMethod: "COD",
        });

      /* -----------------------------------------------------
         CHECK RESPONSE
      ----------------------------------------------------- */

      if (
        !response ||
        response.success !== true
      ) {
        throw new Error(
          response?.message ||
            "Unable to place order"
        );
      }

      /* -----------------------------------------------------
         CLEAR BACKEND CART
      ----------------------------------------------------- */

      try {
        if (
          clearMutation &&
          typeof clearMutation.mutateAsync ===
            "function"
        ) {
          await clearMutation.mutateAsync();
        }
      } catch (clearError) {
        console.error(
          "Backend cart clear error:",
          clearError
        );
      }

      /* -----------------------------------------------------
         CLEAR LOCAL CART
      ----------------------------------------------------- */

      useCartStore
        .getState()
        .clearCart();

      /* -----------------------------------------------------
         SUCCESS MESSAGE
      ----------------------------------------------------- */

      toast.success(
        "Order placed successfully!"
      );

      /* -----------------------------------------------------
         REDIRECT
      ----------------------------------------------------- */

      const orderId =
        response?.order?._id;

      if (orderId) {
        router.push(
          `/order-success?orderId=${orderId}`
        );
      } else {
        router.push(
          "/order-success"
        );
      }
    } catch (
      error: unknown
    ) {
      console.error(
        "Place Order Error:",
        error
      );

      let message =
        "Unable to place order";

      if (
        error instanceof Error
      ) {
        message =
          error.message;
      }

      /*
       * Try to read Axios response
       * without using any.
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

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================
     EMPTY CART
  ======================================================== */

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">

        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111111] p-10 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AF37]/10">

            <MapPin
              size={36}
              className="text-[#D4AF37]"
            />

          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Your Cart Is Empty
          </h1>

          <p className="mt-3 text-gray-400">
            Add some perfumes to your
            cart before proceeding to
            checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/shop")
            }
            className="mt-8 rounded-full bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:scale-105"
          >
            Continue Shopping
          </button>

        </div>

      </main>
    );
  }

  /* ========================================================
     MAIN CHECKOUT UI
  ======================================================== */

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">

      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-12">

          <p className="uppercase tracking-[6px] text-[#D4AF37]">
            MAA Fragora
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Checkout
          </h1>

          <p className="mt-2 text-gray-400">
            Complete your order securely
          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">

          {/* ==================================================
              DELIVERY ADDRESS
          ================================================== */}

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

            <h2 className="mb-8 text-2xl font-semibold">
              Delivery Address
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* FULL NAME */}

              <div>

                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm text-gray-400"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-4 text-gray-500"
                  />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={
                      form.fullName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-white/10 bg-[#181818] py-3 pl-12 pr-4 text-white outline-none transition focus:border-[#D4AF37]"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm text-gray-400"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-4 text-gray-500"
                  />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={10}
                    placeholder="10 digit mobile number"
                    autoComplete="tel"
                    className="w-full rounded-2xl border border-white/10 bg-[#181818] py-3 pl-12 pr-4 text-white outline-none transition focus:border-[#D4AF37]"
                  />

                </div>

              </div>

              {/* ADDRESS */}

              <div>

                <label
                  htmlFor="address"
                  className="mb-2 block text-sm text-gray-400"
                >
                  Complete Address
                </label>

                <input
                  id="address"
                  type="text"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="House / Street / Area"
                  autoComplete="street-address"
                  className="w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                />

              </div>

              {/* CITY + STATE */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm text-gray-400"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                    className="w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  />

                </div>

                <div>

                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm text-gray-400"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                    autoComplete="address-level1"
                    className="w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  />

                </div>

              </div>

              {/* PINCODE */}

              <div>

                <label
                  htmlFor="pincode"
                  className="mb-2 block text-sm text-gray-400"
                >
                  Pincode
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-4 top-4 text-gray-500"
                  />

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={6}
                    placeholder="6 digit pincode"
                    autoComplete="postal-code"
                    className="w-full rounded-2xl border border-white/10 bg-[#181818] py-3 pl-12 pr-4 text-white outline-none transition focus:border-[#D4AF37]"
                  />

                </div>

              </div>

              {/* PAYMENT */}

              <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5">

                <p className="text-sm text-gray-400">
                  Payment Method
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D4AF37]">

                    <div className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />

                  </div>

                  <span className="font-semibold">
                    Cash on Delivery
                  </span>

                </div>

              </div>

              {/* PLACE ORDER */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-full py-4 text-lg font-bold transition ${
                  loading
                    ? "cursor-not-allowed bg-gray-700 text-gray-400"
                    : "bg-[#D4AF37] text-black hover:scale-[1.02]"
                }`}
              >
                {loading
                  ? "Placing Order..."
                  : `Place Order • ₹${totalAmount}`}
              </button>

            </form>

          </section>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <section className="h-fit rounded-3xl border border-white/10 bg-[#111111] p-8">

            <h2 className="mb-8 text-2xl font-semibold">
              Order Summary
            </h2>

            <div className="space-y-5">

              {cart.map(
                (
                  item: CheckoutCartItem
                ) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-white/10 pb-5"
                  >

                    {/* IMAGE */}

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#181818]">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                      />

                    </div>

                    {/* DETAILS */}

                    <div className="flex-1">

                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Qty:{" "}
                        {item.quantity}
                      </p>

                      <p className="mt-2 font-semibold text-[#D4AF37]">
                        ₹
                        {Number(
                          item.price
                        ) *
                          Number(
                            item.quantity
                          )}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* ==================================================
                TOTALS
            ================================================== */}

            <div className="mt-8 space-y-4 border-t border-white/10 pt-6">

              {/* ITEMS */}

              <div className="flex justify-between text-gray-400">

                <span>
                  Items
                </span>

                <span>
                  {totalItems}
                </span>

              </div>

              {/* SUBTOTAL */}

              <div className="flex justify-between text-gray-400">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{totalAmount}
                </span>

              </div>

              {/* DELIVERY */}

              <div className="flex justify-between text-gray-400">

                <span>
                  Delivery
                </span>

                <span className="text-green-500">
                  FREE
                </span>

              </div>

              {/* TOTAL */}

              <div className="flex justify-between border-t border-white/10 pt-5 text-xl font-bold">

                <span>
                  Total
                </span>

                <span className="text-[#D4AF37]">
                  ₹{totalAmount}
                </span>

              </div>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}