import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../utils";

/**
 * 404 handler — must be registered after all routes.
 * Passes a NotFoundError to the error-handling middleware.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};
