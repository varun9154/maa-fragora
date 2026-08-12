import mongoose from "mongoose";
import { env } from "./env";

/*
======================================================
MONGODB CONNECTION
======================================================
*/

let connectionPromise: Promise<typeof mongoose> | null =
  null;

export async function connectDatabase(): Promise<typeof mongoose> {
  /*
  ------------------------------------------------------
  Already connected
  ------------------------------------------------------
  */

  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected");

    return mongoose;
  }

  /*
  ------------------------------------------------------
  Validate URI
  ------------------------------------------------------
  */

  if (!env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not configured."
    );
  }

  /*
  ------------------------------------------------------
  Reuse connection attempt
  ------------------------------------------------------
  */

  if (connectionPromise) {
    console.log(
      "⏳ Reusing existing MongoDB connection attempt..."
    );

    return connectionPromise;
  }

  /*
  ------------------------------------------------------
  Create connection
  ------------------------------------------------------
  */

  console.log(
    "🔄 Attempting MongoDB connection..."
  );

  /*
  NEVER print the complete URI because it contains
  your database password.
  */

  console.log(
    "MongoDB URI configured:",
    Boolean(env.MONGODB_URI)
  );

  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,

      maxPoolSize: 10,
      minPoolSize: 0,

      /*
      Helps with modern MongoDB Atlas connections.
      */
      retryWrites: true,
    })
    .then((connection) => {
      console.log(
        "✅ MongoDB Connected Successfully"
      );

      console.log(
        "MongoDB readyState:",
        mongoose.connection.readyState
      );

      console.log(
        "MongoDB host:",
        connection.connection.host
      );

      console.log(
        "MongoDB database:",
        connection.connection.name
      );

      return connection;
    })
    .catch((error) => {
      console.error(
        "❌ MongoDB Connection Failed"
      );

      console.error(
        "Error name:",
        error instanceof Error
          ? error.name
          : "Unknown"
      );

      console.error(
        "Error message:",
        error instanceof Error
          ? error.message
          : String(error)
      );

      /*
      Allow the next request to retry.
      */
      connectionPromise = null;

      throw error;
    });

  return connectionPromise;
}

/*
======================================================
DATABASE STATUS
======================================================
*/

export function getDatabaseStatus() {
  return {
    readyState:
      mongoose.connection.readyState,

    connected:
      mongoose.connection.readyState === 1,

    connecting:
      mongoose.connection.readyState === 2,

    disconnected:
      mongoose.connection.readyState === 0,

    disconnecting:
      mongoose.connection.readyState === 3,

    host:
      mongoose.connection.host || null,

    database:
      mongoose.connection.name || null,
  };
}