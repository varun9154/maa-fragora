import { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/*
======================================================
ENVIRONMENT CONFIGURATION
======================================================
*/

const isProduction =
  process.env.NODE_ENV === "production";

/*
------------------------------------------------------
MongoDB URI
------------------------------------------------------

IMPORTANT:
Do NOT silently fall back to localhost in production.

A Vercel deployment must use MONGODB_URI from
Vercel Environment Variables.
------------------------------------------------------
*/

const mongodbUri = process.env.MONGODB_URI;

if (isProduction && !mongodbUri) {
  throw new Error(
    "❌ MONGODB_URI is missing in the production environment. Please add MONGODB_URI to Vercel Environment Variables."
  );
}

/*
------------------------------------------------------
JWT Secret
------------------------------------------------------
*/

const jwtSecret =
  process.env.JWT_SECRET;

if (isProduction && !jwtSecret) {
  throw new Error(
    "❌ JWT_SECRET is missing in the production environment."
  );
}

/*
======================================================
EXPORT ENVIRONMENT
======================================================
*/

export const env = {
  PORT:
    process.env.PORT ?? "5000",

  NODE_ENV:
    process.env.NODE_ENV ?? "development",

  /*
  Local development can use the local MongoDB
  fallback, but production MUST use Vercel's
  MONGODB_URI.
  */
  MONGODB_URI:
    mongodbUri ??
    "mongodb://127.0.0.1:27017/maa-fragora",

  JWT_SECRET:
    jwtSecret ??
    "maa_fragora_secret",

  JWT_EXPIRE:
    (process.env.JWT_EXPIRE ?? "7d") as SignOptions["expiresIn"],

  FRONTEND_URL:
    process.env.FRONTEND_URL ??
    "http://localhost:3000",
};