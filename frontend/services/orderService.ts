import api from "@/lib/api";

export interface OrderItemInput {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  totalAmount: number;
  shippingAddress: ShippingAddressInput;
  paymentMethod?: string;
}

export async function createOrder(
  data: CreateOrderInput
) {
  const response =
    await api.post(
      "/orders",
      data
    );

  return response.data;
}

export async function getOrders() {
  const response =
    await api.get("/orders");

  return response.data;
}

export async function getOrderById(
  id: string
) {
  const response =
    await api.get(
      `/orders/${id}`
    );

  return response.data;
}

export async function getOrdersByUser(
  userId: string
) {
  const response =
    await api.get(
      `/orders/user/${userId}`
    );

  return response.data;
}

export async function updateOrderStatus(
  id: string,
  orderStatus: string
) {
  const response =
    await api.put(
      `/orders/${id}`,
      {
        orderStatus,
      }
    );

  return response.data;
}

export async function cancelOrder(
  id: string
) {
  const response =
    await api.put(
      `/orders/${id}/cancel`
    );

  return response.data;
}