import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

/*
======================================================
SERVER STARTUP
======================================================
*/

/*
------------------------------------------------------
LOCAL DEVELOPMENT

For local development we still:

1. Connect PostgreSQL
2. Start Express
3. Listen on localhost:5000

------------------------------------------------------

VERCEL

Vercel does NOT need app.listen().

Vercel imports the Express app and handles
the incoming HTTP request.
------------------------------------------------------
*/

async function startLocalServer() {
  try {
    await connectDatabase();

    const port = Number(
      process.env.PORT ||
        env.PORT ||
        5000
    );

    app.listen(port, () => {
      console.log(
        `🚀 Server running on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Local server startup failed:"
    );

    console.error(error);

    process.exit(1);
  }
}

/*
======================================================
DETECT ENVIRONMENT
======================================================
*/

const isVercel =
  process.env.VERCEL === "1";

/*
======================================================
LOCAL SERVER
======================================================
*/

if (!isVercel) {
  startLocalServer();
}

/*
======================================================
VERCEL / EXPRESS EXPORT
======================================================

Vercel receives the Express application through
the default export.

The database connection happens through the middleware
in app.ts when database-dependent routes are called.
======================================================
*/

export default app;