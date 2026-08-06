"use client";

import { Truck, Zap, PackageCheck } from "lucide-react";
import { useState } from "react";

export type DeliveryType =
  | "standard"
  | "express"
  | "same-day";

interface DeliveryMethodProps {
  onSelect?: (method: DeliveryType) => void;
}

export default function DeliveryMethod({
  onSelect,
}: DeliveryMethodProps) {
  const [selected, setSelected] =
    useState<DeliveryType>("standard");

  const methods = [
    {
      id: "standard",
      icon: Truck,
      title: "Standard Delivery",
      description: "Delivered within 4–6 Business Days",
      price: "FREE",
      estimate: "Estimated: 5 Days",
    },
    {
      id: "express",
      icon: Zap,
      title: "Express Delivery",
      description: "Delivered within 1–2 Business Days",
      price: "₹99",
      estimate: "Estimated: Tomorrow",
    },
    {
      id: "same-day",
      icon: PackageCheck,
      title: "Same Day Delivery",
      description: "Available in selected cities",
      price: "₹199",
      estimate: "Today (Metro Cities)",
    },
  ] as const;

  const handleSelect = (method: DeliveryType) => {
    setSelected(method);

    if (onSelect) {
      onSelect(method);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">

      <h2 className="mb-8 text-3xl font-bold">
        Delivery Method
      </h2>

      <div className="space-y-5">

        {methods.map((method) => {
          const Icon = method.icon;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => handleSelect(method.id)}
              className={`w-full rounded-2xl border p-6 text-left transition-all duration-300 ${
                selected === method.id
                  ? "border-[#D4AF37] bg-[#181818] shadow-[0_0_25px_rgba(212,175,55,.15)]"
                  : "border-white/10 hover:border-[#D4AF37]"
              }`}
            >
              <div className="flex items-center justify-between">

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

                  <div>

                    <h3 className="text-xl font-semibold">
                      {method.title}
                    </h3>

                    <p className="mt-1 text-gray-400">
                      {method.description}
                    </p>

                    <p className="mt-2 text-sm text-[#D4AF37]">
                      {method.estimate}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-2xl font-bold text-[#D4AF37]">
                    {method.price}
                  </p>

                </div>

              </div>
            </button>
          );
        })}

      </div>

    </div>
  );
}