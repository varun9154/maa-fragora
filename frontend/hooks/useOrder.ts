"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrderById } from "@/services/orderService";

export default function useOrder(
  id?: string
) {
  const orderQuery = useQuery({
    queryKey: ["order", id],

    queryFn: () =>
      getOrderById(
        id as string
      ),

    enabled: Boolean(id),
  });

  return {
    orderQuery,
  };
}