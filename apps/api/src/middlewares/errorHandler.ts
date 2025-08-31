import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
}
