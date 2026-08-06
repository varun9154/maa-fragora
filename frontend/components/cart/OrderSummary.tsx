"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

export default function OrderSummary() {
  const { totalItems, totalPrice } = useCartStore();

  return (
    <Card>

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

          <span className="text-green-500">
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
        className="block mt-8"
      >
        <Button fullWidth>
          Proceed To Checkout
        </Button>
      </Link>

    </Card>
  );
}