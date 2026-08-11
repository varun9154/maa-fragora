import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function startServer() {
  try {
    await connectDatabase();

    const port = Number(process.env.PORT ?? env.PORT ?? 5000);

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
  }
}

startServer();