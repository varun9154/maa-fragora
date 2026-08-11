import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

/* ======================================================
   SERVER STARTUP
====================================================== */

async function startServer() {
  try {
    /* ----------------------------------------------
       Connect to MongoDB
    ---------------------------------------------- */

    await connectDatabase();

    /* ----------------------------------------------
       Server Port
       
       Local:
       PORT from .env / env.ts

       Vercel:
       PORT provided by the runtime when applicable
    ---------------------------------------------- */

    const port = Number(
      process.env.PORT || env.PORT || 5000
    );

    /* ----------------------------------------------
       Start Express Server
    ---------------------------------------------- */

    app.listen(port, () => {
      console.log(
        `🚀 Server running on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Server startup failed:",
      error
    );

    process.exit(1);
  }
}

/* ======================================================
   START SERVER
====================================================== */

startServer();

/* ======================================================
   EXPORT APP
====================================================== */

export default app;