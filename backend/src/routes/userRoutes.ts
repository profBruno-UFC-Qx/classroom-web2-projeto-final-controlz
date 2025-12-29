import { Router } from "express";
import { asyncHandler } from "../http/asyncHandler";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { UserRole } from "../entities/enums";
import { UserController } from "../controllers/UserController";

export function userRoutes() {
  const r = Router();
  const c = new UserController();

  // usuário autenticado (somente próprio)
  r.get("/me", authRequired, asyncHandler(c.me));
  r.put("/me", authRequired, asyncHandler(c.updateMe));
  r.delete("/me", authRequired, asyncHandler(c.deleteMe));

  // admin
  r.get("/", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminList));
  r.post("/", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminCreate));
  r.get("/:id", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminGet));
  r.put("/:id", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminUpdate));
  r.delete("/:id", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminDelete));

  return r;
}


