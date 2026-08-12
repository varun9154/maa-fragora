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
Database URL
------------------------------------------------------
*/

const databaseUrl = process.env.DATABASE_URL;

if (isProduction && !databaseUrl) {
  throw new Error(
    "❌ DATABASE_URL is missing in the production environment. Please add DATABASE_URL to Vercel Environment Variables."
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

  DATABASE_URL:
    databaseUrl ??
    "postgresql://postgres:postgres@127.0.0.1:5432/maa_fragora",

  JWT_SECRET:
    jwtSecret ??
    "maa_fragora_secret",

  JWT_EXPIRE:
    (process.env.JWT_EXPIRE ?? "7d") as SignOptions["expiresIn"],

  FRONTEND_URL:
    process.env.FRONTEND_URL ??
    "http://localhost:3000",
};