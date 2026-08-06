"use client";

import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";

const orders = [
  {
    orderId: "MF1001",
    date: "06 Aug 2026",
    total: 2498,
    status: "Shipped" as const,
  },
  {
    orderId: "MF1002",
    date: "01 Aug 2026",
    total: 999,
    status: "Delivered" as const,
  },
];

export default function OrderList() {
  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard
          key={order.orderId}
          {...order}
        />
      ))}
    </div>
  );
}