"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  ShoppingBag,
  Loader2,
  RefreshCw,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

type Product = {
  _id?: string;
  name?: string;
  slug?: string;
  images?: string[];
  price?: number;
};

type OrderItem = {
  productId?: Product | string | null;
  name?: string;
  image?: string;
  quantity?: number;
  price?: number;
};

type ShippingAddress = {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

type Order = {
  _id: string;
  userId?: string | null;
  items?: OrderItem[];
  totalAmount?: number;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

type OrdersResponse = {
  success: boolean;
  count?: number;
  orders?: Order[];
  message?: string;
};

const getApiBaseUrl = () => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!configuredUrl) {
    return "http://localhost:5000/api";
  }

  if (configuredUrl.endsWith("/api")) {
    return configuredUrl;
  }

  return `${configuredUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const possibleKeys = [
    "accessToken",
    "token",
    "authToken",
    "jwt",
    "maa_fragora_token",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  /*
   * Some projects store authentication
   * inside an object.
   */

  const possibleObjects = [
    "user",
    "auth",
    "authUser",
    "currentUser",
  ];

  for (const key of possibleObjects) {
    const value = localStorage.getItem(key);

    if (!value) {
      continue;
    }

    try {
      const parsed = JSON.parse(value);

      const token =
        parsed?.token ||
        parsed?.accessToken ||
        parsed?.jwt;

      if (token) {
        return token;
      }
    } catch {
      // Ignore invalid JSON.
    }
  }

  return null;
}

function formatPrice(value?: number) {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date?: string) {
  if (!date) {
    return "Date unavailable";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderNumber(id: string) {
  if (!id) {
    return "MF-ORDER";
  }

  return `MF-${id.slice(-8).toUpperCase()}`;
}

function getStatusDetails(status?: string) {
  const normalized =
    String(status || "Placed").toLowerCase();

  if (normalized === "delivered") {
    return {
      label: "Delivered",
      className:
        "border-green-500/30 bg-green-500/10 text-green-400",
      icon: CheckCircle2,
    };
  }

  if (
    normalized === "shipped" ||
    normalized === "out for delivery"
  ) {
    return {
      label:
        normalized === "shipped"
          ? "Shipped"
          : "Out for Delivery",
      className:
        "border-blue-500/30 bg-blue-500/10 text-blue-400",
      icon: Truck,
    };
  }

  if (normalized === "processing") {
    return {
      label: "Processing",
      className:
        "border-purple-500/30 bg-purple-500/10 text-purple-400",
      icon: Package,
    };
  }

  if (normalized === "confirmed") {
    return {
      label: "Confirmed",
      className:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
      icon: CheckCircle2,
    };
  }

  if (normalized === "cancelled") {
    return {
      label: "Cancelled",
      className:
        "border-red-500/30 bg-red-500/10 text-red-400",
      icon: XCircle,
    };
  }

  return {
    label: "Placed",
    className:
      "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]",
    icon: Clock3,
  };
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  /*
   * Fetch customer orders.
   */

  const fetchOrders = async (
    showRefreshLoader = false
  ) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getStoredToken();

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization =
          token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;
      }

      const response =
        await axios.get<OrdersResponse>(
          `${API_BASE_URL}/orders/my-orders`,
          {
            headers,
            withCredentials: true,
          }
        );

      if (
        response.data?.success
      ) {
        setOrders(
          Array.isArray(
            response.data.orders
          )
            ? response.data.orders
            : []
        );
      } else {
        setOrders([]);

        setError(
          response.data?.message ||
            "Unable to load your orders."
        );
      }
    } catch (err) {
      console.error(
        "Fetch My Orders Error:",
        err
      );

      if (
        axios.isAxiosError(err)
      ) {
        if (
          err.response?.status === 401
        ) {
          setError(
            "Please login to view your orders."
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load your orders. Please try again."
          );
        }
      } else {
        setError(
          "Unable to load your orders. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
   * Load orders when page opens.
   */

  useEffect(() => {
    fetchOrders();
  }, []);

  /*
   * Summary.
   */

  const totalOrders = orders.length;

  const totalItems = useMemo(() => {
    return orders.reduce(
      (total, order) => {
        const items =
          Array.isArray(order.items)
            ? order.items
            : [];

        return (
          total +
          items.reduce(
            (itemTotal, item) =>
              itemTotal +
              Number(
                item.quantity || 0
              ),
            0
          )
        );
      },
      0
    );
  }, [orders]);

  /*
   * Loading state.
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-6 py-20">
          <div className="flex flex-col items-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" />

            <p className="mt-5 text-lg text-gray-300">
              Loading your orders...
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please wait a moment.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-20">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </Link>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[6px] text-[#D4AF37]">
              MAA FRAGORA
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
              Track your fragrance purchases,
              view order details and follow
              your delivery journey.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-red-400">
                  {error}
                </p>

                {error.toLowerCase().includes(
                  "login"
                ) && (
                  <p className="mt-1 text-sm text-gray-400">
                    Sign in to your MAA Fragora
                    account to continue.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                {error
                  .toLowerCase()
                  .includes("login") ? (
                  <Link
                    href="/login?redirect=/orders"
                    className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e5c04b]"
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      fetchOrders(true)
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            STATS
        ==================================================== */}

        {orders.length > 0 && (
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <p className="mt-2 text-3xl font-bold text-[#D4AF37]">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
              <p className="text-sm text-gray-500">
                Products Purchased
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalItems}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
              <div>
                <p className="text-sm text-gray-500">
                  Order History
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  Recently purchased
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  fetchOrders(true)
                }
                disabled={refreshing}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:opacity-50"
                aria-label="Refresh orders"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {!error &&
          orders.length === 0 && (
            <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0b0b0b] px-6 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <ShoppingBag className="h-9 w-9 text-[#D4AF37]" />
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                No orders yet
              </h2>

              <p className="mt-3 max-w-md leading-7 text-gray-400">
                Your fragrance journey starts
                here. Explore our premium
                collection and find your
                signature scent.
              </p>

              <Link
                href="/shop"
                className="mt-8 rounded-full bg-[#D4AF37] px-7 py-3 font-semibold text-black transition hover:bg-[#e5c04b]"
              >
                Explore Fragrances
              </Link>
            </div>
          )}

        {/* ====================================================
            ORDERS
        ==================================================== */}

        {orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => {
              const items =
                Array.isArray(
                  order.items
                )
                  ? order.items
                  : [];

              const firstItem =
                items[0];

              const additionalItems =
                Math.max(
                  items.length - 1,
                  0
                );

              const status =
                getStatusDetails(
                  order.orderStatus
                );

              const StatusIcon =
                status.icon;

              const itemCount =
                items.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.quantity || 0
                    ),
                  0
                );

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] transition hover:border-[#D4AF37]/25"
                >
                  {/* ==========================================
                      ORDER HEADER
                  ========================================== */}

                  <div className="flex flex-col gap-5 border-b border-white/10 p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-semibold">
                          {getOrderNumber(
                            order._id
                          )}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />

                          {status.label}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        Ordered on{" "}
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col items-start lg:items-end">
                      <span className="text-2xl font-bold text-[#D4AF37]">
                        {formatPrice(
                          order.totalAmount
                        )}
                      </span>

                      <span className="mt-1 text-sm text-gray-500">
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}
                      </span>
                    </div>
                  </div>

                  {/* ==========================================
                      ORDER BODY
                  ========================================== */}

                  <div className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      {/* PRODUCT IMAGE */}

                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
                        {firstItem?.image ||
                        (typeof firstItem?.productId !==
                          "string" &&
                          firstItem?.productId
                            ?.images?.[0]) ? (
                          <img
                            src={
                              firstItem
                                ?.image ||
                              (typeof firstItem?.productId !==
                                "string"
                                ? firstItem
                                    ?.productId
                                    ?.images?.[0]
                                : "") ||
                              "/images/placeholder-product.jpg"
                            }
                            alt={
                              firstItem?.name ||
                              (typeof firstItem?.productId !==
                                "string"
                                ? firstItem
                                    ?.productId
                                    ?.name
                                : "") ||
                              "Product"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-8 w-8 text-gray-700" />
                          </div>
                        )}
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold">
                          {firstItem?.name ||
                            (typeof firstItem?.productId !==
                              "string"
                              ? firstItem
                                  ?.productId
                                  ?.name
                              : "") ||
                            "MAA Fragora Perfume"}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          Quantity:{" "}
                          {firstItem
                            ?.quantity ||
                            1}
                        </p>

                        {additionalItems >
                          0 && (
                          <p className="mt-1 text-sm text-[#D4AF37]">
                            +{" "}
                            {
                              additionalItems
                            }{" "}
                            more{" "}
                            {additionalItems ===
                            1
                              ? "product"
                              : "products"}
                          </p>
                        )}

                        {order.shippingAddress
                          ?.city && (
                          <p className="mt-3 text-sm text-gray-500">
                            Delivering to{" "}
                            {
                              order
                                .shippingAddress
                                .city
                            }
                            ,{" "}
                            {
                              order
                                .shippingAddress
                                .state
                            }
                          </p>
                        )}
                      </div>

                      {/* VIEW ORDER */}

                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#D4AF37]/40 px-5 py-2.5 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                      >
                        View Order

                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* ========================================
                        PAYMENT INFO
                    ======================================== */}

                    <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-3">
                      <div>
                        <span className="text-gray-600">
                          Payment
                        </span>

                        <p className="mt-1 text-gray-300">
                          {order.paymentMethod ||
                            "COD"}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">
                          Payment Status
                        </span>

                        <p
                          className={`mt-1 ${
                            String(
                              order.paymentStatus ||
                                ""
                            ).toLowerCase() ===
                            "paid"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {order.paymentStatus ||
                            "Pending"}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">
                          Delivery
                        </span>

                        <p className="mt-1 text-gray-300">
                          {status.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ====================================================
            CONTINUE SHOPPING
        ==================================================== */}

        {orders.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3 text-sm font-medium text-gray-300 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}