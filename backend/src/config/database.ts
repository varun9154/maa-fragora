import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

export async function connectDatabase() {
  try {
    if (isConnected && mongoose.connection.readyState === 1) {
      return;
    }

    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(env.MONGODB_URI);

    isConnected = true;

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    isConnected = false;

    console.error("❌ MongoDB Connection Failed");
    console.error(error);

    throw error;
  }
}