import { Router } from "express";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { OpportunityController } from "../controllers/OpportunityController";
import { OpportunityManageController } from "../controllers/OpportunityManageController";
import { UserRole } from "../entities/enums";
import { asyncHandler } from "../http/asyncHandler";

// Rotas de oportunidades com acesso publico e area de gerenciamento
export function opportunityRoutes() {
  const r = Router();
  const c = new OpportunityController();
  const m = new OpportunityManageController();

  // Listagem publica de oportunidades (sem autenticacao)
  r.get("/", asyncHandler(c.listPublic));

  // CRUD restrito a admin e instituicoes
  r.post(
    "/",
    authRequired,
    requireRole(UserRole.ADMIN, UserRole.INSTITUTION),
    asyncHandler(m.create)
  );
  r.put(
    "/:id",
    authRequired,
    requireRole(UserRole.ADMIN, UserRole.INSTITUTION),
    asyncHandler(m.update)
  );
  r.delete(
    "/:id",
    authRequired,
    requireRole(UserRole.ADMIN, UserRole.INSTITUTION),
    asyncHandler(m.remove)
  );

  return r;
}
