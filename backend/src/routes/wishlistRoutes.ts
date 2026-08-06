import { Router } from "express";

import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
} from "../controllers/wishlistController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getWishlist);

router.post("/", protect, addToWishlist);

router.delete("/:productId", protect, removeWishlistItem);

export default router;