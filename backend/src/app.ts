import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { connectDatabase, getDatabaseStatus } from "./config/database";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();

/*
======================================================
CORS CONFIGURATION
======================================================
*/

const allowedOrigins: string[] = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",

  /*
  Main Maa Fragora frontend
  */
  "https://maa-fragora.vercel.app",

  /*
  Allow configured frontend URL
  */
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      /*
      Allow requests without Origin header.

      Useful for:
      - Postman
      - Browser direct requests
      - Server-to-server requests
      */

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("⚠️ CORS blocked origin:", origin);

      return callback(
        new Error(`CORS policy blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/*
======================================================
SECURITY
======================================================
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/*
======================================================
COMPRESSION
======================================================
*/

app.use(compression());

/*
======================================================
LOGGING
======================================================
*/

app.use(morgan("dev"));

/*
======================================================
BODY PARSING
======================================================
*/

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/*
======================================================
COOKIE PARSER
======================================================
*/

app.use(cookieParser());

/*
======================================================
ROOT ROUTE
======================================================
*/

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 Maa Fragora Backend API Running Successfully",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

/*
======================================================
HEALTH CHECK
======================================================
IMPORTANT:

Health endpoint does NOT require the database connection.

This allows us to check whether Vercel
is running even when the database is unavailable.
======================================================
*/

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus(),
  });
});

/*
======================================================
DATABASE MIDDLEWARE
======================================================

Every database-dependent API request will make sure the database is connected before reaching the route.

This is the important Vercel fix.
======================================================
*/

const databaseMiddleware = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
  OPTIONS requests are handled by CORS and do not need
  a database connection.
  */

  if (_req.method === "OPTIONS") {
    return next();
  }

  try {
    await connectDatabase();

    next();
  } catch (error) {
    console.error(
      "❌ Database middleware failed:"
    );

    console.error(error);

    return res.status(503).json({
      success: false,
      message: "Database connection unavailable",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error instanceof Error
          ? error.message
          : String(error),
    });
  }
};

/*
======================================================
API ROUTES
======================================================
*/

/*
------------------------------------------------------
Authentication
------------------------------------------------------
*/

app.use(
  "/api/auth",
  databaseMiddleware,
  authRoutes
);

/*
------------------------------------------------------
Products
------------------------------------------------------
*/

app.use(
  "/api/products",
  databaseMiddleware,
  productRoutes
);

/*
------------------------------------------------------
Cart
------------------------------------------------------
*/

app.use(
  "/api/cart",
  databaseMiddleware,
  cartRoutes
);

/*
------------------------------------------------------
Wishlist
------------------------------------------------------
*/

app.use(
  "/api/wishlist",
  databaseMiddleware,
  wishlistRoutes
);

/*
------------------------------------------------------
Orders
------------------------------------------------------
*/

app.use(
  "/api/orders",
  databaseMiddleware,
  orderRoutes
);

/*
======================================================
404 ROUTE
======================================================
*/

app.use(
  (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "Route Not Found",
      path: req.originalUrl,
    });
  }
);

/*
======================================================
GLOBAL ERROR HANDLER
======================================================
*/

app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("❌ Global Express Error:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",

      /*
      Never expose detailed production errors.
      */
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message,
    });
  }
);

/*
======================================================
EXPORT APP
======================================================
*/

export default app;