import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./httpErrors";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details ?? null,
    });
  }

  // fallback
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
}




