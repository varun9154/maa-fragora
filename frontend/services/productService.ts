import api from "@/lib/api";

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}) {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
}

export async function getProductBySlug(
  slug: string
) {
  const response = await api.get(
    `/products/${slug}`
  );

  return response.data;
}