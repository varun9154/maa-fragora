"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getProducts,
  getProductBySlug,
} from "@/services/productService";

export function useProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ["products", params],

    queryFn: () =>
      getProducts(params),

    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(
  slug: string
) {
  return useQuery({
    queryKey: ["product", slug],

    queryFn: () =>
      getProductBySlug(slug),

    enabled: !!slug,

    staleTime: 1000 * 60 * 5,
  });
}