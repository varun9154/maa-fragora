import { Router } from "express";

import {
  createOrder,
  getOrders,
} from "../controllers/orderController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

export default router;