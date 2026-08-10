"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/services/customerService";

export default function useCustomers() {
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return {
    customersQuery,
  };
}