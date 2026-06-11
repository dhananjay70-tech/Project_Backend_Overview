import "./config/env.config"; // Load & validate env first
import { env } from "./config/env.config";
import { connectDatabase, disconnectDatabase } from "./config/database.config";
import { logger } from "./logger";
import createApp from "./app";

const startServer = async (): Promise<void> => {
  // Connect to database
  logger.info("Connecting to database...");
  await connectDatabase();
  logger.info("Database connected successfully");

  // Create Express application
  const app = createApp();

  // Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running`, {
      port: env.PORT,
      environment: env.NODE_ENV,
    });
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.warn(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info("HTTP server closed");
      await disconnectDatabase();
      logger.info("Database disconnected");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("uncaughtException", (err: Error) => {
    logger.error("Uncaught Exception", { message: err.message, stack: err.stack });
    process.exit(1);
  });

  process.on("unhandledRejection", (reason: unknown) => {
    logger.error("Unhandled Rejection", { reason });
    process.exit(1);
  });
};

startServer().catch((err: Error) => {
  logger.error("Failed to start server", { message: err.message, stack: err.stack });
  process.exit(1);
});
