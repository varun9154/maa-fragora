"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams =
    useSearchParams();

  const orderId =
    searchParams.get("orderId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">

      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111111] p-10 text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle
            size={60}
            className="text-green-500"
          />
        </div>

        <p className="mt-8 uppercase tracking-[5px] text-[#D4AF37]">
          MAA Fragora
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Order Confirmed
        </h1>

        <p className="mt-4 leading-7 text-gray-400">
          Thank you for shopping with
          MAA Fragora. Your order has
          been successfully placed.
        </p>

        {orderId && (
          <div className="mt-8 rounded-2xl bg-[#181818] p-5">

            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-2 break-all font-mono text-sm text-[#D4AF37]">
              {orderId}
            </p>

          </div>
        )}

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:scale-105"
        >
          Continue Shopping
        </Link>

      </div>

    </main>
  );
}