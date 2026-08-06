"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrders, placeOrder } from "@/services/orderService";

export default function useOrder() {
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
  });

  return {
    ordersQuery,
    placeOrderMutation,
  };
}