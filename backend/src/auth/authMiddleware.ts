import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./jwt";
import { HttpError } from "../http/httpErrors";
import { UserRole } from "../entities/enums";

export type AuthUser = {
  id: string;
  role: UserRole;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Não autenticado"));
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(new HttpError(401, "Token inválido"));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, "Não autenticado"));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, "Sem permissão"));
    return next();
  };
}




