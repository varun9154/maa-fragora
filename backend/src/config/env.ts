import { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT ?? "5000",

  NODE_ENV: process.env.NODE_ENV ?? "development",

  MONGODB_URI:
    process.env.MONGODB_URI ??
    "mongodb://127.0.0.1:27017/maa-fragora",

  JWT_SECRET:
    process.env.JWT_SECRET ??
    "maa_fragora_secret",

  JWT_EXPIRE:
    (process.env.JWT_EXPIRE ?? "7d") as SignOptions["expiresIn"],

  FRONTEND_URL:
    process.env.FRONTEND_URL ?? "http://localhost:3000",
};