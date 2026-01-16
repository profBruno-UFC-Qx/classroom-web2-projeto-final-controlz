import { Router } from "express";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { ApplicationController } from "../controllers/ApplicationController";
import { UserRole } from "../entities/enums";
import { asyncHandler } from "../http/asyncHandler";

// Rotas de aplicacoes com regras de papel para cada acao
export function applicationRoutes() {
  const r = Router();
  const c = new ApplicationController();

  // Fluxo do aluno: aplicar e listar as proprias aplicacoes
  r.post(
    "/",
    authRequired,
    requireRole(UserRole.STUDENT),
    asyncHandler(c.studentApply)
  );
  r.get(
    "/me",
    authRequired,
    requireRole(UserRole.STUDENT),
    asyncHandler(c.studentMyList)
  );

  // Fluxo da instituicao: ver aplicacoes recebidas
  r.get(
    "/institution",
    authRequired,
    requireRole(UserRole.INSTITUTION),
    asyncHandler(c.institutionList)
  );

  // Fluxo do admin: listar todas
  r.get(
    "/",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminList)
  );

  // Admin e instituicao podem alterar status de uma aplicacao
  r.patch(
    "/:id/status",
    authRequired,
    requireRole(UserRole.ADMIN, UserRole.INSTITUTION),
    asyncHandler(c.setStatus)
  );

  return r;
}
