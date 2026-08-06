import api from "@/lib/api";

export async function getWishlist() {
  const response = await api.get("/wishlist");

  return response.data;
}

export async function addWishlist(
  productId: string
) {
  const response = await api.post(
    "/wishlist",
    {
      productId,
    }
  );

  return response.data;
}

export async function removeWishlist(
  productId: string
) {
  const response = await api.delete(
    `/wishlist/${productId}`
  );

  return response.data;
}