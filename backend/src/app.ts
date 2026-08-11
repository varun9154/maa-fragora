import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();

/* ======================================================
   CORS CONFIGURATION
====================================================== */

const allowedOrigins: string[] = [
  "http://localhost:3000",
  "https://maa-fragora.vercel.app",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ======================================================
   SECURITY MIDDLEWARE
====================================================== */

app.use(helmet());

/* ======================================================
   COMPRESSION
====================================================== */

app.use(compression());

/* ======================================================
   LOGGING
====================================================== */

app.use(morgan("dev"));

/* ======================================================
   BODY PARSING
====================================================== */

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ======================================================
   COOKIE PARSER
====================================================== */

app.use(cookieParser());

/* ======================================================
   ROOT ROUTE
====================================================== */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Maa Fragora Backend API Running Successfully",
    version: "1.0.0",
  });
});

/* ======================================================
   HEALTH CHECK
====================================================== */

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

/* ======================================================
   API ROUTES
====================================================== */

/* Authentication */
app.use("/api/auth", authRoutes);

/* Products */
app.use("/api/products", productRoutes);

/* Cart */
app.use("/api/cart", cartRoutes);

/* Wishlist */
app.use("/api/wishlist", wishlistRoutes);

/* Orders */
app.use("/api/orders", orderRoutes);

/* ======================================================
   404 ROUTE
   MUST BE AFTER ALL API ROUTES
====================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.originalUrl,
  });
});

/* ======================================================
   EXPORT APP
====================================================== */

export default app;