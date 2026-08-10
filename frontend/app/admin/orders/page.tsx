"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

import useOrders from "@/hooks/useOrders";

const STATUS_OPTIONS = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt?: string;
}

export default function OrdersPage() {
  const {
    ordersQuery,
    updateStatusMutation,
  } = useOrders();

  const [search, setSearch] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const orders: Order[] =
    ordersQuery.data?.orders || [];

  const filteredOrders = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return orders;
    }

    return orders.filter(
      (order) =>
        order._id
          .toLowerCase()
          .includes(value) ||
        order.shippingAddress.fullName
          .toLowerCase()
          .includes(value) ||
        order.shippingAddress.phone
          .includes(value) ||
        order.userId?.email
          ?.toLowerCase()
          .includes(value)
    );
  }, [orders, search]);

  const handleStatusChange = async (
    orderId: string,
    orderStatus: string
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        orderStatus,
      });

      toast.success(
        "Order status updated"
      );

      await ordersQuery.refetch();

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(
          (previous) =>
            previous
              ? {
                  ...previous,
                  orderStatus,
                }
              : null
        );
      }
    } catch (error: any) {
      console.error(
        "Update order status error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to update order status"
      );
    }
  };

  if (ordersQuery.isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-[#D4AF37]"
            size={32}
          />

          <p className="mt-4 text-gray-400">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
        <h2 className="text-2xl font-bold text-red-400">
          Unable to Load Orders
        </h2>

        <p className="mt-3 text-gray-400">
          Please check the backend and try
          again.
        </p>

        <button
          type="button"
          onClick={() =>
            ordersQuery.refetch()
          }
          className="mt-6 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="uppercase tracking-[5px] text-[#D4AF37]">
            MAA Fragora
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Orders
          </h1>

          <p className="mt-2 text-gray-400">
            Manage customer orders and
            delivery status
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            ordersQuery.refetch()
          }
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* SEARCH */}

      <div className="mb-8 max-w-xl">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-4 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by order ID, customer, phone or email..."
            className="w-full rounded-2xl border border-white/10 bg-[#111111] py-3 pl-12 pr-4 text-white outline-none transition focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* SUMMARY */}

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
          <p className="text-sm text-gray-400">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            {orders.length}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
          <p className="text-sm text-gray-400">
            Placed
          </p>

          <p className="mt-2 text-3xl font-bold text-[#D4AF37]">
            {
              orders.filter(
                (order) =>
                  order.orderStatus ===
                  "Placed"
              ).length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
          <p className="text-sm text-gray-400">
            Processing
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            {
              orders.filter(
                (order) =>
                  order.orderStatus ===
                  "Processing"
              ).length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
          <p className="text-sm text-gray-400">
            Delivered
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {
              orders.filter(
                (order) =>
                  order.orderStatus ===
                  "Delivered"
              ).length
            }
          </p>
        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">

                <th className="px-6 py-5">
                  Order
                </th>

                <th className="px-6 py-5">
                  Customer
                </th>

                <th className="px-6 py-5">
                  Items
                </th>

                <th className="px-6 py-5">
                  Total
                </th>

                <th className="px-6 py-5">
                  Payment
                </th>

                <th className="px-6 py-5">
                  Status
                </th>

                <th className="px-6 py-5 text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center"
                  >
                    <Package
                      size={40}
                      className="mx-auto text-gray-600"
                    />

                    <p className="mt-4 text-gray-400">
                      No orders found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(
                  (order) => (
                    <tr
                      key={order._id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >

                      <td className="px-6 py-5">

                        <p className="font-mono text-sm text-[#D4AF37]">
                          #
                          {order._id.slice(-8)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <p className="font-semibold">
                          {
                            order
                              .shippingAddress
                              .fullName
                          }
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {
                            order
                              .shippingAddress
                              .phone
                          }
                        </p>

                      </td>

                      <td className="px-6 py-5">
                        {order.items.reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            Number(
                              item.quantity
                            ),
                          0
                        )}
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#D4AF37]">
                        ₹
                        {Number(
                          order.totalAmount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-6 py-5">

                        <p>
                          {
                            order.paymentMethod
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {
                            order.paymentStatus
                          }
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <select
                          value={
                            order.orderStatus
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          disabled={
                            updateStatusMutation.isPending
                          }
                          className="rounded-xl border border-white/10 bg-[#181818] px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                                className="bg-[#181818]"
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>

                      </td>

                      <td className="px-6 py-5 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          className="rounded-full border border-white/10 p-3 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                        >
                          <Eye
                            size={18}
                          />
                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111] p-8 text-white"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Order
                </p>

                <h2 className="mt-1 font-mono text-xl text-[#D4AF37]">
                  #{selectedOrder._id}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-full border border-white/10 px-4 py-2 text-gray-400 hover:text-white"
              >
                Close
              </button>

            </div>

            {/* CUSTOMER */}

            <div className="mt-8 rounded-2xl bg-[#181818] p-5">

              <h3 className="font-semibold">
                Customer
              </h3>

              <p className="mt-3">
                {
                  selectedOrder
                    .shippingAddress
                    .fullName
                }
              </p>

              <p className="mt-1 text-gray-400">
                {
                  selectedOrder
                    .shippingAddress
                    .phone
                }
              </p>

              {selectedOrder.userId?.email && (
                <p className="mt-1 text-gray-400">
                  {
                    selectedOrder.userId
                      .email
                  }
                </p>
              )}

            </div>

            {/* ADDRESS */}

            <div className="mt-5 rounded-2xl bg-[#181818] p-5">

              <h3 className="font-semibold">
                Delivery Address
              </h3>

              <p className="mt-3 text-gray-400">
                {
                  selectedOrder
                    .shippingAddress
                    .address
                }
                <br />
                {
                  selectedOrder
                    .shippingAddress
                    .city
                }
                ,{" "}
                {
                  selectedOrder
                    .shippingAddress
                    .state
                }
                <br />
                {
                  selectedOrder
                    .shippingAddress
                    .pincode
                }
              </p>

            </div>

            {/* ITEMS */}

            <div className="mt-5">

              <h3 className="mb-4 font-semibold">
                Products
              </h3>

              <div className="space-y-4">

                {selectedOrder.items.map(
                  (item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex items-center justify-between border-b border-white/10 pb-4"
                    >

                      <div className="flex items-center gap-4">

                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-[#181818]">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-2"
                          />

                        </div>

                        <div>

                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </p>

                        </div>

                      </div>

                      <p className="font-semibold text-[#D4AF37]">
                        ₹
                        {(
                          Number(
                            item.price
                          ) *
                          Number(
                            item.quantity
                          )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* TOTAL */}

            <div className="mt-6 flex justify-between border-t border-white/10 pt-6 text-xl font-bold">

              <span>
                Total
              </span>

              <span className="text-[#D4AF37]">
                ₹
                {Number(
                  selectedOrder.totalAmount
                ).toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}