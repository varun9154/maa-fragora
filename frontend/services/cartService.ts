import api from "@/lib/api";

/*
|--------------------------------------------------------------------------
| GET CART
|--------------------------------------------------------------------------
*/

export async function getCart() {
  const response = await api.get("/cart");

  return response.data;
}

/*
|--------------------------------------------------------------------------
| ADD TO CART
|--------------------------------------------------------------------------
*/

export async function addToCart(
  productId: string,
  quantity = 1
) {
  const response = await api.post(
    "/cart",
    {
      productId,
      quantity,
    }
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| UPDATE CART
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| REMOVE CART ITEM
|--------------------------------------------------------------------------
*/

export async function removeCartItem(
  productId: string
) {
  const response = await api.delete(
    `/cart/${productId}`
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| CLEAR CART
|--------------------------------------------------------------------------
*/

export async function clearCart() {
  const response = await api.delete(
    "/cart"
  );

  return response.data;
}