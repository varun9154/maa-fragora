import mongoose from "mongoose";
import { env } from "./env";

/*
======================================================
MONGODB CONNECTION
======================================================
Works for:

1. Local development
2. Vercel serverless
3. Warm Vercel instances
4. Multiple API requests
======================================================
*/

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  /*
  ------------------------------------------------------
  Already connected
  ------------------------------------------------------
  */

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  /*
  ------------------------------------------------------
  Validate MongoDB URI
  ------------------------------------------------------
  */

  if (!env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Please configure MONGODB_URI in Vercel Environment Variables."
    );
  }

  /*
  ------------------------------------------------------
  Reuse an existing connection attempt
  ------------------------------------------------------
  Important for Vercel serverless environments.
  ------------------------------------------------------
  */

  if (connectionPromise) {
    return connectionPromise;
  }

  /*
  ------------------------------------------------------
  Create MongoDB connection
  ------------------------------------------------------
  */

  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 0,
    })
    .then((connection) => {
      console.log("✅ MongoDB Connected Successfully");

      return connection;
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Failed");
      console.error(error);

      /*
      Allow a future request to try again.
      */
      connectionPromise = null;

      throw error;
    });

  return connectionPromise;
}

/*
======================================================
MONGODB STATUS
======================================================
*/

export function getDatabaseStatus() {
  return {
    readyState: mongoose.connection.readyState,
    connected: mongoose.connection.readyState === 1,
    connecting: mongoose.connection.readyState === 2,
    disconnected: mongoose.connection.readyState === 0,
    disconnecting: mongoose.connection.readyState === 3,
  };
}