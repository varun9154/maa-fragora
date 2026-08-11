import { Router } from "express";

import {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| CART ROUTES
|--------------------------------------------------------------------------
|
| All cart operations require an authenticated customer.
|
|--------------------------------------------------------------------------
*/

/*
 * GET /api/cart
 *
 * Get current customer's cart
 */
router.get(
  "/",
  protect,
  getCart
);

/*
 * POST /api/cart
 *
 * Add product to current customer's cart
 */
router.post(
  "/",
  protect,
  addToCart
);

/*
 * PUT /api/cart/:productId
 *
 * Update quantity
 */
router.put(
  "/:productId",
  protect,
  updateCart
);

/*
 * DELETE /api/cart/:productId
 *
 * Remove item
 */
router.delete(
  "/:productId",
  protect,
  removeCartItem
);

/*
 * DELETE /api/cart
 *
 * Clear cart
 */
router.delete(
  "/",
  protect,
  clearCart
);

export default router;