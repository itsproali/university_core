/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "http";
import app from "./app";
import config from "./config";

// Uncaught exception
process.on("uncaughtException", (err: any) => {
  console.error("UNCAUGHT EXCEPTION! 💣 Shutting down...");
  console.error(err.message);
  process.exit(1);
});

async function bootstrap() {
  const server: Server = app.listen(config.PORT, () => {
    console.info(`Server listening on port ${config.PORT}`);
  });

  // Unhandled promise rejection
  process.on("unhandledRejection", (err: any) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.message);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });

  // SIGTERM
  process.on("SIGTERM", () => {
    console.info("SIGTERM RECEIVED 🚦 Shutting down gracefully");
    if (server) {
      server.close();
    }
  });
}

bootstrap();
