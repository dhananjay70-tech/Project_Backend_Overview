import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async Express route handler so that any thrown errors
 * are forwarded to the next() error-handling middleware automatically.
 * Eliminates repetitive try/catch blocks in controllers.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
