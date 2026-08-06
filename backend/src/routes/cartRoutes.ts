import { Router } from "express";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getCart);

router.post("/", protect, addToCart);

router.put("/:productId", protect, updateCartItem);

router.delete("/:productId", protect, removeCartItem);

router.delete("/", protect, clearCart);

export default router;