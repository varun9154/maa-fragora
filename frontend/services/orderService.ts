import api from "@/lib/api";

/* ==========================================================
   ORDER ITEM
========================================================== */

export interface OrderItemInput {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

/* ==========================================================
   SHIPPING ADDRESS
========================================================== */

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

/* ==========================================================
   CREATE ORDER INPUT
========================================================== */

export interface CreateOrderInput {
  items: OrderItemInput[];
  totalAmount: number;
  shippingAddress: ShippingAddressInput;
  paymentMethod?: string;
}

/* ==========================================================
   CREATE ORDER PAYLOAD
   Alias of CreateOrderInput so both types always match.
========================================================== */

export type CreateOrderPayload = CreateOrderInput;

/* ==========================================================
   CREATE ORDER
========================================================== */

export async function createOrder(
  data: CreateOrderInput
) {
  const response = await api.post(
    "/orders",
    data
  );

  return response.data;
}

/* ==========================================================
   GET ALL ORDERS
========================================================== */

export async function getOrders() {
  const response = await api.get(
    "/orders"
  );

  return response.data;
}

/* ==========================================================
   GET ORDER BY ID
========================================================== */

export async function getOrderById(
  id: string
) {
  const response = await api.get(
    `/orders/${id}`
  );

  return response.data;
}

/* ==========================================================
   GET ORDERS BY USER
========================================================== */

export async function getOrdersByUser(
  userId: string
) {
  const response = await api.get(
    `/orders/user/${userId}`
  );

  return response.data;
}

/* ==========================================================
   UPDATE ORDER STATUS
========================================================== */

export async function updateOrderStatus(
  id: string,
  orderStatus: string
) {
  const response = await api.put(
    `/orders/${id}`,
    {
      orderStatus,
    }
  );

  return response.data;
}

/* ==========================================================
   CANCEL ORDER
========================================================== */

export async function cancelOrder(
  id: string
) {
  const response = await api.put(
    `/orders/${id}/cancel`
  );

  return response.data;
}