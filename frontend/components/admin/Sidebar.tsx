"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Star,
  Ticket,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Products",
    icon: Package,
    href: "/admin/products",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    title: "Categories",
    icon: Tags,
    href: "/admin/categories",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/admin/customers",
  },
  {
    title: "Reviews",
    icon: Star,
    href: "/admin/reviews",
  },
  {
    title: "Coupons",
    icon: Ticket,
    href: "/admin/coupons",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-white/10 bg-[#111111]">

      <div className="border-b border-white/10 p-8">

        <h1 className="text-3xl font-bold">

          <span className="text-[#D4AF37]">MAA</span>{" "}

          Fragora

        </h1>

      </div>

      <nav className="mt-6">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-4 px-8 py-4 text-gray-300 transition hover:bg-[#D4AF37] hover:text-black"
            >

              <Icon size={20} />

              {item.title}

            </Link>
          );

        })}

      </nav>

    </aside>
  );
}