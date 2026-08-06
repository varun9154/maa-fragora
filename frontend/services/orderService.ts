import api from "@/lib/api";

export async function placeOrder(data: any) {
  const response = await api.post("/orders", data);
  return response.data;
}

export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}