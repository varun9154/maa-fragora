"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
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

type OrderResponse = {
  success: boolean;
  order?: Order;
  message?: string;
};

const getApiBaseUrl = () => {
  const configured =
    process.env.NEXT_PUBLIC_API_URL?.replace(
      /\/+$/,
      ""
    );

  if (!configured) {
    return "http://localhost:5000/api";
  }

  if (configured.endsWith("/api")) {
    return configured;
  }

  return `${configured}/api`;
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

  const directKeys = [
    "accessToken",
    "token",
    "authToken",
    "jwt",
    "maa_fragora_token",
  ];

  for (const key of directKeys) {
    const value =
      localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  const objectKeys = [
    "user",
    "auth",
    "authUser",
    "currentUser",
  ];

  for (const key of objectKeys) {
    const value =
      localStorage.getItem(key);

    if (!value) {
      continue;
    }

    try {
      const parsed =
        JSON.parse(value);

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
  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

function formatDate(
  date?: string
) {
  if (!date) {
    return "Date unavailable";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

function formatDateTime(
  date?: string
) {
  if (!date) {
    return "Date unavailable";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return parsed.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function getOrderNumber(
  id: string
) {
  return `MF-${id
    .slice(-8)
    .toUpperCase()}`;
}

function normalizeStatus(
  status?: string
) {
  return String(
    status || "Placed"
  ).toLowerCase();
}

function getProductName(
  item: OrderItem
) {
  if (item.name) {
    return item.name;
  }

  if (
    item.productId &&
    typeof item.productId !==
      "string"
  ) {
    return (
      item.productId.name ||
      "MAA Fragora Perfume"
    );
  }

  return "MAA Fragora Perfume";
}

function getProductImage(
  item: OrderItem
) {
  if (item.image) {
    return item.image;
  }

  if (
    item.productId &&
    typeof item.productId !==
      "string"
  ) {
    return (
      item.productId.images?.[0] ||
      ""
    );
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| Tracking steps
|--------------------------------------------------------------------------
*/

const trackingSteps = [
  {
    key: "placed",
    label: "Order Placed",
    description:
      "Your order has been successfully placed.",
    icon: ShoppingBag,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    description:
      "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    key: "processing",
    label: "Processing",
    description:
      "Your fragrance is being prepared.",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped",
    description:
      "Your order is on its way.",
    icon: Truck,
  },
  {
    key: "out-for-delivery",
    label: "Out for Delivery",
    description:
      "Your order is arriving soon.",
    icon: MapPin,
  },
  {
    key: "delivered",
    label: "Delivered",
    description:
      "Your order has been delivered.",
    icon: Check,
  },
];

/*
|--------------------------------------------------------------------------
| Get tracking index
|--------------------------------------------------------------------------
*/

function getTrackingIndex(
  status?: string
) {
  const normalized =
    normalizeStatus(status);

  switch (normalized) {
    case "placed":
      return 0;

    case "confirmed":
      return 1;

    case "processing":
      return 2;

    case "shipped":
      return 3;

    case "out for delivery":
      return 4;

    case "delivered":
      return 5;

    default:
      return 0;
  }
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderIdParam =
    params?.id;

  const orderId = Array.isArray(
    orderIdParam
  )
    ? orderIdParam[0]
    : orderIdParam;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);

  /*
   * Fetch order.
   */

  const fetchOrder = async () => {
    if (!orderId) {
      setError(
        "Invalid order ID."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        getStoredToken();

      const headers: Record<
        string,
        string
      > = {
        Accept:
          "application/json",
      };

      if (token) {
        headers.Authorization =
          token.startsWith(
            "Bearer "
          )
            ? token
            : `Bearer ${token}`;
      }

      const response =
        await axios.get<OrderResponse>(
          `${API_BASE_URL}/orders/${orderId}`,
          {
            headers,
            withCredentials: true,
          }
        );

      if (
        response.data?.success &&
        response.data.order
      ) {
        setOrder(
          response.data.order
        );
      } else {
        setError(
          response.data?.message ||
            "Order not found."
        );
      }
    } catch (err) {
      console.error(
        "Fetch Order Details Error:",
        err
      );

      if (
        axios.isAxiosError(err)
      ) {
        if (
          err.response?.status ===
          401
        ) {
          setError(
            "Please login to view this order."
          );
        } else {
          setError(
            err.response?.data
              ?.message ||
              "Unable to load order details."
          );
        }
      } else {
        setError(
          "Unable to load order details."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  /*
   * Cancel order.
   */

  const handleCancelOrder =
    async () => {
      if (
        !orderId ||
        !order
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this order?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancelling(true);

        const token =
          getStoredToken();

        const headers: Record<
          string,
          string
        > = {};

        if (token) {
          headers.Authorization =
            token.startsWith(
              "Bearer "
            )
              ? token
              : `Bearer ${token}`;
        }

        const response =
          await axios.put(
            `${API_BASE_URL}/orders/${orderId}/cancel`,
            {},
            {
              headers,
              withCredentials: true,
            }
          );

        if (
          response.data?.success
        ) {
          setOrder(
            response.data.order
          );

          window.alert(
            "Order cancelled successfully."
          );
        }
      } catch (err) {
        console.error(
          "Cancel Order Error:",
          err
        );

        if (
          axios.isAxiosError(err)
        ) {
          window.alert(
            err.response?.data
              ?.message ||
              "Unable to cancel order."
          );
        } else {
          window.alert(
            "Unable to cancel order."
          );
        }
      } finally {
        setCancelling(false);
      }
    };

  /*
   * Calculations.
   */

  const items =
    Array.isArray(order?.items)
      ? order.items
      : [];

  const totalItems =
    useMemo(() => {
      return items.reduce(
        (total, item) =>
          total +
          Number(
            item.quantity || 0
          ),
        0
      );
    }, [items]);

  const currentTrackingIndex =
    getTrackingIndex(
      order?.orderStatus
    );

  const isCancelled =
    normalizeStatus(
      order?.orderStatus
    ) === "cancelled";

  const canCancel =
    !isCancelled &&
    ![
      "shipped",
      "out for delivery",
      "delivered",
    ].includes(
      normalizeStatus(
        order?.orderStatus
      )
    );

  /*
   * Loading.
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <section className="flex min-h-[75vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#D4AF37]" />

            <p className="mt-5 text-gray-300">
              Loading order details...
            </p>
          </div>
        </section>
      </main>
    );
  }

  /*
   * Error.
   */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <section className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-6 py-20">
          <div className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Unable to Load Order
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-gray-400">
              {error ||
                "The requested order could not be found."}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/orders"
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
              >
                My Orders
              </Link>

              <Link
                href="/shop"
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c04b]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-16">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>

          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[5px] text-[#D4AF37]">
                MAA FRAGORA
              </p>

              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                Order Details
              </h1>

              <p className="mt-3 text-gray-400">
                {getOrderNumber(
                  order._id
                )}
              </p>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-sm text-gray-500">
                Order placed
              </p>

              <p className="mt-1 text-gray-200">
                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* ====================================================
            CANCELLED BANNER
        ==================================================== */}

        {isCancelled && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <div className="flex items-start gap-4">
              <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-400" />

              <div>
                <p className="font-semibold text-red-400">
                  Order Cancelled
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-400">
                  This order has been
                  cancelled and will not
                  be delivered.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TRACKING
        ==================================================== */}

        {!isCancelled && (
          <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[3px] text-[#D4AF37]">
                  Order Tracking
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {order.orderStatus ||
                    "Placed"}
                </h2>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 sm:flex">
                <Truck className="h-5 w-5 text-[#D4AF37]" />
              </div>
            </div>

            {/* Desktop tracking */}

            <div className="mt-10 hidden md:block">
              <div className="relative">
                {/* Connecting line */}

                <div className="absolute left-[8%] right-[8%] top-6 h-px bg-white/10" />

                <div
                  className="absolute left-[8%] top-6 h-px bg-[#D4AF37] transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      currentTrackingIndex /
                        (trackingSteps.length -
                          1),
                      1
                    ) *
                      84}%`,
                  }}
                />

                <div className="relative grid grid-cols-6">
                  {trackingSteps.map(
                    (
                      step,
                      index
                    ) => {
                      const Icon =
                        step.icon;

                      const completed =
                        index <=
                        currentTrackingIndex;

                      const current =
                        index ===
                        currentTrackingIndex;

                      return (
                        <div
                          key={
                            step.key
                          }
                          className="flex flex-col items-center text-center"
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                              completed
                                ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                                : "border-white/10 bg-[#111] text-gray-600"
                            } ${
                              current
                                ? "ring-4 ring-[#D4AF37]/10"
                                : ""
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <p
                            className={`mt-4 text-sm font-medium ${
                              completed
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          >
                            {step.label}
                          </p>

                          <p
                            className={`mt-2 max-w-[140px] text-xs leading-5 ${
                              current
                                ? "text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            {
                              step.description
                            }
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Mobile tracking */}

            <div className="mt-8 space-y-6 md:hidden">
              {trackingSteps.map(
                (
                  step,
                  index
                ) => {
                  const Icon =
                    step.icon;

                  const completed =
                    index <=
                    currentTrackingIndex;

                  const current =
                    index ===
                    currentTrackingIndex;

                  return (
                    <div
                      key={
                        step.key
                      }
                      className="relative flex gap-4"
                    >
                      {index <
                        trackingSteps.length -
                          1 && (
                        <div
                          className={`absolute left-5 top-11 h-[calc(100%+1.5rem)] w-px ${
                            index <
                            currentTrackingIndex
                              ? "bg-[#D4AF37]"
                              : "bg-white/10"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                          completed
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/10 bg-[#111] text-gray-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p
                          className={`font-medium ${
                            completed
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        >
                          {step.label}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {
                            step.description
                          }
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            ORDER ITEMS + SUMMARY
        ==================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ITEMS */}

          <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[3px] text-[#D4AF37]">
                  Your Fragrances
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Order Items
                </h2>
              </div>

              <span className="text-sm text-gray-500">
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="mt-8 divide-y divide-white/10">
              {items.map(
                (
                  item,
                  index
                ) => {
                  const image =
                    getProductImage(
                      item
                    );

                  const name =
                    getProductName(
                      item
                    );

                  const quantity =
                    Number(
                      item.quantity ||
                        1
                    );

                  const price =
                    Number(
                      item.price ||
                        (typeof item.productId !==
                        "string"
                          ? item
                              .productId
                              ?.price
                          : 0) ||
                        0
                    );

                  const slug =
                    typeof item.productId !==
                    "string"
                      ? item.productId
                          ?.slug
                      : undefined;

                  return (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex gap-4 py-5 first:pt-0 last:pb-0"
                    >
                      {/* Image */}

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
                        {image ? (
                          <img
                            src={
                              image
                            }
                            alt={
                              name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-7 w-7 text-gray-700" />
                          </div>
                        )}
                      </div>

                      {/* Info */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            {slug ? (
                              <Link
                                href={`/product/${slug}`}
                                className="font-semibold text-white transition hover:text-[#D4AF37]"
                              >
                                {
                                  name
                                }
                              </Link>
                            ) : (
                              <p className="font-semibold">
                                {
                                  name
                                }
                              </p>
                            )}

                            <p className="mt-2 text-sm text-gray-500">
                              Quantity:{" "}
                              {
                                quantity
                              }
                            </p>
                          </div>

                          <p className="font-semibold text-[#D4AF37]">
                            {formatPrice(
                              price *
                                quantity
                            )}
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                          {formatPrice(
                            price
                          )}{" "}
                          each
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* SUMMARY */}

          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[3px] text-[#D4AF37]">
                Summary
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Order Total
              </h2>

              <div className="mt-7 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Items
                  </span>

                  <span className="text-gray-300">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Payment
                  </span>

                  <span className="text-gray-300">
                    {order.paymentMethod ||
                      "COD"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Payment Status
                  </span>

                  <span
                    className={
                      String(
                        order.paymentStatus ||
                          ""
                      ).toLowerCase() ===
                      "paid"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {order.paymentStatus ||
                      "Pending"}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-base text-gray-300">
                      Total
                    </span>

                    <span className="text-3xl font-bold text-[#D4AF37]">
                      {formatPrice(
                        order.totalAmount
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                SHIPPING ADDRESS
            ================================================== */}

            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#D4AF37]" />

                <h2 className="text-xl font-bold">
                  Delivery Address
                </h2>
              </div>

              <div className="mt-5 text-sm leading-7 text-gray-400">
                <p className="font-semibold text-white">
                  {
                    order
                      .shippingAddress
                      ?.fullName
                  }
                </p>

                <p>
                  {
                    order
                      .shippingAddress
                      ?.address
                  }
                </p>

                <p>
                  {
                    order
                      .shippingAddress
                      ?.city
                  }
                  ,{" "}
                  {
                    order
                      .shippingAddress
                      ?.state
                  }{" "}
                  -{" "}
                  {
                    order
                      .shippingAddress
                      ?.pincode
                  }
                </p>

                <p className="mt-2">
                  Phone:{" "}
                  {
                    order
                      .shippingAddress
                      ?.phone
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            ORDER META
        ==================================================== */}

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Order Number
              </p>

              <p className="mt-2 text-sm font-medium text-gray-300">
                {getOrderNumber(
                  order._id
                )}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Order Date
              </p>

              <p className="mt-2 text-sm font-medium text-gray-300">
                {formatDateTime(
                  order.createdAt
                )}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Current Status
              </p>

              <p className="mt-2 text-sm font-medium text-[#D4AF37]">
                {order.orderStatus ||
                  "Placed"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Last Updated
              </p>

              <p className="mt-2 text-sm font-medium text-gray-300">
                {formatDateTime(
                  order.updatedAt
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row">
            {canCancel && (
              <button
                type="button"
                onClick={
                  handleCancelOrder
                }
                disabled={
                  cancelling
                }
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 px-6 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </>
                )}
              </button>
            )}

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c04b]"
            >
              Continue Shopping
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}