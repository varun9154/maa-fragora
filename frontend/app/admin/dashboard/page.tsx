"use client";

import DashboardCard from "@/components/admin/DashboardCard";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] p-10">

      <h1 className="mb-10 text-4xl font-bold text-white">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Revenue"
          value={`₹${data.revenue}`}
        />

        <DashboardCard
          title="Orders"
          value={data.orders}
        />

        <DashboardCard
          title="Products"
          value={data.products}
        />

        <DashboardCard
          title="Customers"
          value={data.customers}
        />

      </div>

    </main>
  );
}