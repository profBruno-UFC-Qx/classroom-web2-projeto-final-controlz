import { Router } from "express";
import { authRequired } from "../auth/authMiddleware";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../http/asyncHandler";

// Rotas de autenticacao basica (registro, login, perfil e logout)
export function authRoutes() {
  const r = Router();
  const c = new AuthController();

  // Registro e login publicos
  r.post("/register", asyncHandler(c.register));
  r.post("/login", asyncHandler(c.login));

  // Endpoints que exigem usuario autenticado
  r.get("/me", authRequired, asyncHandler(c.me));
  r.post("/logout", authRequired, asyncHandler(c.logout));

  return r;
}
