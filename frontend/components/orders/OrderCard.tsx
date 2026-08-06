"use client";

import Link from "next/link";

interface OrderCardProps {
  orderId: string;
  date: string;
  total: number;
  status: "Pending" | "Packed" | "Shipped" | "Delivered";
}

export default function OrderCard({
  orderId,
  date,
  total,
  status,
}: OrderCardProps) {
  const statusColor = {
    Pending: "bg-yellow-500",
    Packed: "bg-blue-500",
    Shipped: "bg-purple-500",
    Delivered: "bg-green-500",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            #{orderId}
          </h2>

          <p className="mt-2 text-gray-400">
            {date}
          </p>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${statusColor[status]}`}
        >
          {status}
        </span>

      </div>

      <div className="mt-8 flex items-center justify-between">

        <p className="text-3xl font-bold text-[#D4AF37]">
          ₹{total}
        </p>

        <Link
          href={`/orders/${orderId}`}
          className="rounded-full border border-[#D4AF37] px-6 py-3 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}