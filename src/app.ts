import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env.config";
import { logger } from "./logger";
import { errorHandler, notFoundHandler } from "./middlewares";
import { ApiSuccessResponse } from "./utils";
import { HTTP_STATUS } from "./constants";

// Module routers
import productsRouter from "./app/products/products.routes";

const createApp = (): Application => {
  const app = express();

  // ─── Security & parsing middlewares ───────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ─── HTTP request logger (morgan → winston) ───────────────────────────────
  app.use(
    morgan("combined", {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    })
  );

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get("/health", (_req: Request, res: Response) => {
    new ApiSuccessResponse("Server is healthy", {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    }).send(res, HTTP_STATUS.OK);
  });

  // ─── API routers ──────────────────────────────────────────────────────────
  app.use("/api/v1/products", productsRouter);

  // ─── 404 & error handling (must be last) ─────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
