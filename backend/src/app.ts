import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import customerRoutes from "./routes/customerRoutes";

const app = express();

/* ==========================================================
   MIDDLEWARE
========================================================== */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL || "",
    ],
    credentials: true,
  })
);

app.use(helmet());

app.use(compression());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ==========================================================
   HEALTH CHECK
========================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🚀 MAA Fragora Backend Running Successfully",
  });
});

/* ==========================================================
   API ROUTES
========================================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);

/* ==========================================================
   404 HANDLER
========================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.originalUrl,
  });
});

/* ==========================================================
   GLOBAL ERROR HANDLER
========================================================== */

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(
      "Global Error:",
      err
    );

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

export default app;