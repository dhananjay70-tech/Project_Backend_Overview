import winston from "winston";
import { env } from "../config/env.config";

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `[${timestamp}] ${level}: ${stack ?? message}${metaStr}`;
  })
);

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

class Logger {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: env.NODE_ENV === "production" ? "warn" : "debug",
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
        new winston.transports.File({
          filename: "dist/error.log",
          level: "error",
          format: fileFormat,
        }),
        new winston.transports.File({
          filename: "dist/combined.log",
          format: fileFormat,
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({ filename: "dist/exceptions.log" }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: "dist/rejections.log" }),
      ],
    });
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  http(message: string, meta?: Record<string, unknown>): void {
    this.logger.http(message, meta);
  }
}

export const logger = new Logger();
