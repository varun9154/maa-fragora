"use client";

import {
  CreditCard,
  Landmark,
  Smartphone,
  Banknote,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";

export type PaymentType =
  | "upi"
  | "card"
  | "netbanking"
  | "cod";

interface PaymentMethodProps {
  onSelect?: (method: PaymentType) => void;
}

export default function PaymentMethod({
  onSelect,
}: PaymentMethodProps) {
  const [selected, setSelected] =
    useState<PaymentType>("upi");

  const methods = [
    {
      id: "upi",
      icon: Smartphone,
      title: "UPI Payment",
      subtitle: "Google Pay • PhonePe • Paytm",
      badge: "Recommended",
    },
    {
      id: "card",
      icon: CreditCard,
      title: "Credit / Debit Card",
      subtitle: "Visa • Mastercard • RuPay",
      badge: "Secure",
    },
    {
      id: "netbanking",
      icon: Landmark,
      title: "Net Banking",
      subtitle: "All Major Indian Banks",
      badge: "Fast",
    },
    {
      id: "cod",
      icon: Banknote,
      title: "Cash On Delivery",
      subtitle: "Pay after receiving your order",
      badge: "Available",
    },
  ] as const;

  const handleSelect = (method: PaymentType) => {
    setSelected(method);

    onSelect?.(method);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          Payment Method
        </h2>

        <div className="flex items-center gap-2 text-sm text-green-400">

          <ShieldCheck size={18} />

          <span>100% Secure</span>

        </div>

      </div>

      <div className="space-y-5">

        {methods.map((method) => {

          const Icon = method.icon;

          return (

            <button
              key={method.id}
              type="button"
              onClick={() => handleSelect(method.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-5 transition-all duration-300 ${
                selected === method.id
                  ? "border-[#D4AF37] bg-[#1b1b1b] shadow-[0_0_25px_rgba(212,175,55,.15)]"
                  : "border-white/10 hover:border-[#D4AF37]"
              }`}
            >

              <div className="flex items-center gap-5">

                <div
                  className={`rounded-full p-3 ${
                    selected === method.id
                      ? "bg-[#D4AF37] text-black"
                      : "bg-white/10"
                  }`}
                >
                  <Icon size={24} />
                </div>

                <div className="text-left">

                  <h3 className="text-lg font-semibold">

                    {method.title}

                  </h3>

                  <p className="mt-1 text-sm text-gray-400">

                    {method.subtitle}

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-semibold text-[#D4AF37]">

                  {method.badge}

                </span>

                <div
                  className={`h-6 w-6 rounded-full border-2 ${
                    selected === method.id
                      ? "border-[#D4AF37] bg-[#D4AF37]"
                      : "border-gray-500"
                  }`}
                />

              </div>

            </button>

          );

        })}

      </div>

    </div>
  );
}