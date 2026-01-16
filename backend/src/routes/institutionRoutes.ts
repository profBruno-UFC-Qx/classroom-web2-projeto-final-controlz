import { Router } from "express";
import { InstitutionController } from "../controllers/InstitutionController";
import { asyncHandler } from "../http/asyncHandler";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { UserRole } from "../entities/enums";

export function institutionRoutes() {
  const r = Router();
  const c = new InstitutionController();

  // Instituição (somente o próprio usuário instituição)
  r.get("/me", authRequired, requireRole(UserRole.INSTITUTION), asyncHandler(c.getMe));
  r.put("/me", authRequired, requireRole(UserRole.INSTITUTION), asyncHandler(c.upsertMe));

  // Admin
  r.get("/", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminList));
  r.post("/:id/approve", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminApprove));
  r.post("/:id/reject", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminReject));

  return r;
}



