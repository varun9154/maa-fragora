import api from "@/lib/api";

export const getCustomers = async () => {
  const response = await api.get("/customers");
  return response.data.customers;
};

export const getCustomer = async (id: string) => {
  const response = await api.get(`/customers/${id}`);
  return response.data.customer;
};