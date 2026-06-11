import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.util";
import { ApiErrorResponse } from "../utils/api-response.util";
import { HTTP_STATUS } from "../constants";
import { logger } from "../logger";

/**
 * Global error-handling middleware.
 * Must have exactly 4 parameters so Express recognises it as an error handler.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    logger.warn("Zod validation error", { path: req.path, errors });
    new ApiErrorResponse("Validation failed", errors).send(
      res,
      HTTP_STATUS.BAD_REQUEST
    );
    return;
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.statusCode}]: ${err.message}`, {
      path: req.path,
      method: req.method,
      stack: err.stack,
    });
    new ApiErrorResponse(err.message).send(res, err.statusCode);
    return;
  }

  // Unknown / programmer errors
  const errorMessage =
    err instanceof Error ? err.message : "An unexpected error occurred";
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error("Unhandled error", {
    path: req.path,
    method: req.method,
    message: errorMessage,
    stack,
  });

  new ApiErrorResponse("Internal Server Error").send(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};
