import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../http/asyncHandler";
import { authRequired } from "../auth/authMiddleware";

export function authRoutes() {
  const r = Router();
  const c = new AuthController();

  r.post("/register", asyncHandler(c.register));
  r.post("/login", asyncHandler(c.login));
  r.get("/me", authRequired, asyncHandler(c.me));
  r.post("/logout", authRequired, asyncHandler(c.logout));

  return r;
}



