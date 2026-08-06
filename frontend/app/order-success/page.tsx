import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center">

          <div className="rounded-full bg-green-500/20 p-6">

            <CheckCircle2
              size={90}
              className="text-green-400"
            />

          </div>

          <h1 className="mt-10 text-5xl font-bold">
            Order Placed Successfully!
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Thank you for shopping with
            <span className="font-semibold text-[#D4AF37]">
              {" "}MAA Fragora
            </span>.
            Your luxury fragrance order has been received and is being prepared for dispatch.
          </p>

          <div className="mt-14 grid w-full gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-[#111] p-6">

              <h3 className="text-xl font-semibold">
                Order Status
              </h3>

              <p className="mt-3 text-green-400">
                Confirmed
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-6">

              <h3 className="text-xl font-semibold">
                Payment
              </h3>

              <p className="mt-3 text-[#D4AF37]">
                Pending / COD
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-6">

              <h3 className="text-xl font-semibold">
                Delivery
              </h3>

              <p className="mt-3 text-blue-400">
                3–5 Business Days
              </p>

            </div>

          </div>

          <div className="mt-16 flex flex-col gap-5 sm:flex-row">

            <Link
              href="/orders"
              className="rounded-full bg-[#D4AF37] px-10 py-4 font-bold text-black transition hover:scale-105"
            >
              View My Orders
            </Link>

            <Link
              href="/shop"
              className="rounded-full border border-[#D4AF37] px-10 py-4 font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              Continue Shopping
            </Link>

          </div>

          <div className="mt-20 flex items-center gap-3 text-gray-400">

            <ShoppingBag size={20} />

            <span>
              Thank you for choosing MAA Fragora.
            </span>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}