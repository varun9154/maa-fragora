"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminProducts,
  deleteProduct,
} from "@/services/adminProductService";

export default function useAdminProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });

  return {
    productsQuery,
    deleteMutation,
  };
}