import { Router } from "express";
import { asyncHandler } from "../http/asyncHandler";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { UserRole } from "../entities/enums";
import { ApplicationController } from "../controllers/ApplicationController";

export function applicationRoutes() {
  const r = Router();
  const c = new ApplicationController();

  // aluno
  r.post("/", authRequired, requireRole(UserRole.STUDENT), asyncHandler(c.studentApply));
  r.get("/me", authRequired, requireRole(UserRole.STUDENT), asyncHandler(c.studentMyList));

  // instituicao
  r.get(
    "/institution",
    authRequired,
    requireRole(UserRole.INSTITUTION),
    asyncHandler(c.institutionList),
  );

  // admin
  r.get("/", authRequired, requireRole(UserRole.ADMIN), asyncHandler(c.adminList));

  // admin e instituicao podem alterar status
  r.patch(
    "/:id/status",
    authRequired,
    requireRole(UserRole.ADMIN, UserRole.INSTITUTION),
    asyncHandler(c.setStatus),
  );

  return r;
}



