import { Router } from "express";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { InstitutionController } from "../controllers/InstitutionController";
import { UserRole } from "../entities/enums";
import { asyncHandler } from "../http/asyncHandler";

// Rotas de instituicoes com acoes separadas por papel
export function institutionRoutes() {
  const r = Router();
  const c = new InstitutionController();

  // Instituicao gerencia seu proprio perfil
  r.get(
    "/me",
    authRequired,
    requireRole(UserRole.INSTITUTION),
    asyncHandler(c.getMe)
  );
  r.put(
    "/me",
    authRequired,
    requireRole(UserRole.INSTITUTION),
    asyncHandler(c.upsertMe)
  );

  // Admin lista e modera instituicoes (aprovar/rejeitar)
  r.get(
    "/",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminList)
  );
  r.post(
    "/:id/approve",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminApprove)
  );
  r.post(
    "/:id/reject",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminReject)
  );

  return r;
}
