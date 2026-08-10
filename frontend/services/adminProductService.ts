import api from "../lib/api";

export const getAdminProducts = async () => {
  const response = await api.get("/admin/products");
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post(
    "/admin/products",
    data
  );

  return response.data;
};

export const updateProduct = async (
  id: string,
  data: any
) => {
  const response = await api.put(
    `/admin/products/${id}`,
    data
  );

  return response.data;
};