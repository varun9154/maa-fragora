import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";

const router = Router();

/* ==========================================================
   CREATE ORDER
   POST /api/orders
========================================================== */

router.post(
  "/",
  createOrder
);


/* ==========================================================
   GET ALL ORDERS
   GET /api/orders
========================================================== */

router.get(
  "/",
  getOrders
);


/* ==========================================================
   GET SINGLE ORDER
   GET /api/orders/:id
========================================================== */

router.get(
  "/:id",
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