import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandlerMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  if (Array.isArray(err)) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      })),
    });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
}
