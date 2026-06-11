import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { BadRequestError } from "../utils";
import { logger } from "../logger";

type ZodTarget = "body" | "query" | "params";

/**
 * Zod validation middleware factory.
 * Validates the specified part of the request (body, query, params)
 * against the provided Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate (default: "body")
 */
export const validate =
  (schema: AnyZodObject, target: ZodTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const errors = zodError.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      logger.warn("Zod validation failed", { target, errors });
      return next(
        new BadRequestError("Validation failed")
      );
    }

    // Attach parsed (and stripped/coerced) data back to req
    req[target] = result.data;
    next();
  };
