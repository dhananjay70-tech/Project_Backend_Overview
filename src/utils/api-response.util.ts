import { Response } from "express";

export class ApiSuccessResponse<T = unknown> {
  public readonly success: true = true;
  public readonly message: string;
  public readonly data: T;

  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }

  send(res: Response, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export class ApiErrorResponse {
  public readonly success: false = false;
  public readonly message: string;
  public readonly errors?: unknown[];

  constructor(message: string, errors?: unknown[]) {
    this.message = message;
    this.errors = errors;
  }

  send(res: Response, statusCode: number = 500): Response {
    const body: Record<string, unknown> = {
      success: this.success,
      message: this.message,
    };
    if (this.errors && this.errors.length > 0) {
      body.errors = this.errors;
    }
    return res.status(statusCode).json(body);
  }
}
