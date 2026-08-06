"use client";

import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Truck,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import useOrder from "@/hooks/useOrder";
import { useCartStore } from "@/store/cartStore";
import useHydration from "@/hooks/useHydration";

interface OrderSummaryProps {
  shipping?: number;
}

export default function OrderSummary({
  shipping = 0,
}: OrderSummaryProps) {
  const router = useRouter();

  const hydrated = useHydration();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const { placeOrderMutation } = useOrder();

  const [loading, setLoading] = useState(false);

  // Prevent hydration mismatch
  if (!hydrated) {
    return (
      <div className="sticky top-28 rounded-3xl border border-white/10 bg-[#111111] p-8 animate-pulse">

        <div className="mb-8 h-8 w-56 rounded bg-gray-800" />

        <div className="space-y-5">

          <div className="h-16 rounded bg-gray-800" />

          <div className="h-16 rounded bg-gray-800" />

          <div className="h-16 rounded bg-gray-800" />

        </div>

      </div>
    );
  }

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = subtotal >= 3000 ? 200 : 0;

  const grandTotal =
    subtotal + shipping - discount;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      await placeOrderMutation.mutateAsync({
        shippingAddress: {
          fullName: "Customer",
          phone: "9999999999",
          address: "Address",
          city: "City",
          state: "State",
          pincode: "000000",
        },
        paymentMethod: "COD",
      });

      clearCart();

      router.push("/order-success");
    } catch (error) {
      console.error(error);
      alert("Unable to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-28 rounded-3xl border border-white/10 bg-[#111111] p-8">

      <div className="mb-8 flex items-center gap-3">

        <ShoppingBag
          className="text-[#D4AF37]"
          size={30}
        />

        <h2 className="text-3xl font-bold">
          Order Summary
        </h2>

      </div>

      <div className="space-y-5">

        {items.length === 0 && (
          <p className="text-center text-gray-400">
            Your cart is empty.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-white/10 pb-4"
          >
            <div>

              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-sm text-gray-400">
                Qty: {item.quantity}
              </p>

            </div>

            <span className="font-semibold text-[#D4AF37]">
              ₹{item.price * item.quantity}
            </span>

          </div>
        ))}

      </div>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between">

          <span className="text-gray-400">
            Total Items
          </span>

          <span>{totalItems}</span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Subtotal
          </span>

          <span>₹{subtotal}</span>

        </div>

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

        <div className="border-t border-white/10 pt-6">

          <div className="flex justify-between text-2xl font-bold">

            <span>Total</span>

            <span className="text-[#D4AF37]">
              ₹{grandTotal}
            </span>

          </div>

        </div>

      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || items.length === 0}
        className={`mt-8 w-full rounded-full py-4 text-lg font-bold transition duration-300 ${
          loading || items.length === 0
            ? "cursor-not-allowed bg-gray-700 text-gray-400"
            : "bg-[#D4AF37] text-black hover:scale-105"
        }`}
      >
        {loading
          ? "Placing Order..."
          : "Place Order"}
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-400">

        <ShieldCheck size={18} />

        <span>
          Secure Checkout • SSL Protected
        </span>

      </div>

    </div>
  );
}