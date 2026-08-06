import api from "@/lib/api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProduct = async (slug: string) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};