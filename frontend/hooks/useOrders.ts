"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  CreateOrderPayload,
} from "@/services/orderService";

/* ==========================================================
   ORDERS HOOK
========================================================== */

export default function useOrders() {
  const queryClient =
    useQueryClient();

  /* ========================================================
     GET ALL ORDERS
  ======================================================== */

  const ordersQuery = useQuery({
    queryKey: ["orders"],

    queryFn: getOrders,
  });

  /* ========================================================
     CREATE ORDER
  ======================================================== */

  const placeOrderMutation =
    useMutation({
      mutationFn: (
        data: CreateOrderPayload
      ) => createOrder(data),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      },
    });

  /* ========================================================
     GET SINGLE ORDER
  ======================================================== */

  const getOrderMutation =
    useMutation({
      mutationFn: (
        id: string
      ) => getOrderById(id),
    });

  /* ========================================================
     UPDATE ORDER STATUS
  ======================================================== */

  const updateStatusMutation =
    useMutation({
      mutationFn: ({
        id,
        orderStatus,
      }: {
        id: string;
        orderStatus: string;
      }) =>
        updateOrderStatus(
          id,
          orderStatus
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      },
    });

  return {
    ordersQuery,

    placeOrderMutation,

    getOrderMutation,

    updateStatusMutation,
  };
}