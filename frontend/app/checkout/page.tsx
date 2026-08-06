"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import AddressForm from "@/components/checkout/AddressForm";
import DeliveryMethod from "@/components/checkout/DeliveryMethod";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-14">

            <h1 className="text-5xl font-bold">
              Checkout
            </h1>

            <p className="mt-3 text-gray-400">
              Complete your order securely.
            </p>

          </div>

          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">

            {/* Left Side */}

            <div className="space-y-10">

              <AddressForm />

              <DeliveryMethod />

              <PaymentMethod />

            </div>

            {/* Right Side */}

            <OrderSummary />

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}