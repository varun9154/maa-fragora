import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUser,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

/* ==========================================================
   CREATE ORDER
   POST /api/orders
========================================================== */

router.post(
  "/",
  protect,
  createOrder
);

/* ==========================================================
   GET ALL ORDERS
   GET /api/orders

   Used by admin / existing functionality.
========================================================== */

router.get(
  "/",
  getOrders
);

/* ==========================================================
   GET MY ORDERS
   GET /api/orders/my-orders

   IMPORTANT:
   This route MUST come before /:id.
========================================================== */

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

/* ==========================================================
   GET ORDERS FOR USER
   GET /api/orders/user/:userId

   Existing compatibility route.
========================================================== */

router.get(
  "/user/:userId",
  protect,
  getOrdersByUser
);

/* ==========================================================
   GET SINGLE ORDER
   GET /api/orders/:id
========================================================== */

router.get(
  "/:id",
  protect,
  getOrderById
);

/* ==========================================================
   UPDATE ORDER STATUS
   PUT /api/orders/:id/status
========================================================== */

router.put(
  "/:id/status",
  updateOrderStatus
);

export default router;