"use client";

import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalItems,
    totalPrice,
  } = useCartStore();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-6 py-20">

          <h1 className="mb-10 text-5xl font-bold">
            Shopping Cart
          </h1>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#111111] p-16 text-center">

              <h2 className="text-3xl font-semibold">
                Your Cart is Empty
              </h2>

              <p className="mt-4 text-gray-400">
                Discover our premium fragrances.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-block rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105"
              >
                Continue Shopping
              </Link>

            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">

              {/* Cart Items */}

              <div className="space-y-6">

                {items.map((item) => (

                  <div
                    key={item.id}
                    className="flex items-center gap-6 rounded-3xl border border-white/10 bg-[#111111] p-6"
                  >

                    <div className="relative h-28 w-28 rounded-2xl bg-[#181818]">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />

                    </div>

                    <div className="flex-1">

                      <h2 className="text-2xl font-semibold">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-[#D4AF37] text-xl">
                        ₹{item.price}
                      </p>

                      <div className="mt-5 flex items-center gap-3">

                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-10 w-10 rounded-full border border-white/10"
                        >
                          -
                        </button>

                        <span className="text-lg font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="h-10 w-10 rounded-full border border-white/10"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-full bg-red-500 px-5 py-3 font-semibold transition hover:bg-red-600"
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

              {/* Order Summary */}

              <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">

                <h2 className="text-3xl font-bold">
                  Order Summary
                </h2>

                <div className="mt-8 space-y-5">

                  <div className="flex justify-between">

                    <span>Total Items</span>

                    <span>{totalItems()}</span>

                  </div>

                  <div className="flex justify-between">

                    <span>Subtotal</span>

                    <span>₹{totalPrice()}</span>

                  </div>

                  <div className="flex justify-between">

                    <span>Shipping</span>

                    <span className="text-green-400">
                      FREE
                    </span>

                  </div>

                  <div className="border-t border-white/10 pt-5">

                    <div className="flex justify-between text-2xl font-bold">

                      <span>Total</span>

                      <span className="text-[#D4AF37]">
                        ₹{totalPrice()}
                      </span>

                    </div>

                  </div>

                </div>

                <Link
                  href="/checkout"
                  className="mt-10 block rounded-full bg-[#D4AF37] py-4 text-center text-lg font-semibold text-black transition hover:scale-105"
                >
                  Proceed To Checkout
                </Link>

              </div>

            </div>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}