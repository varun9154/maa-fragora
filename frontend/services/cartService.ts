import api from "@/lib/api";

export async function getCart() {
  const response = await api.get("/cart");
  return response.data;
}

export async function addToCart(
  productId: string,
  quantity = 1
) {
  const response = await api.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
}

export async function updateCart(
  productId: string,
  quantity: number
) {
  const response = await api.put(
    `/cart/${productId}`,
    {
      quantity,
    }
  );

  return response.data;
}

export async function removeCartItem(
  productId: string
) {
  const response = await api.delete(
    `/cart/${productId}`
  );

  return response.data;
}

export async function clearCart() {
  const response = await api.delete("/cart");

  return response.data;
}