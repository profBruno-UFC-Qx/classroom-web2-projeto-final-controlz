import { Router } from "express";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { UserController } from "../controllers/UserController";
import { UserRole } from "../entities/enums";
import { asyncHandler } from "../http/asyncHandler";

// Rotas de usuarios com autogestao e administracao
export function userRoutes() {
  const r = Router();
  const c = new UserController();

  // Usuario autenticado gerencia seu proprio perfil
  r.get("/me", authRequired, asyncHandler(c.me));
  r.put("/me", authRequired, asyncHandler(c.updateMe));
  r.delete("/me", authRequired, asyncHandler(c.deleteMe));

  // Admin tem CRUD completo sobre todos os usuarios
  r.get(
    "/",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminList)
  );
  r.post(
    "/",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminCreate)
  );
  // Admin e instituicao podem ver perfil de usuario (instituicao precisa para ver alunos candidatos)
  r.get(
    "/:id",
    authRequired,
    requireRole(UserRole.ADMIN, UserRole.INSTITUTION),
    asyncHandler(c.adminGet)
  );
  r.put(
    "/:id",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminUpdate)
  );
  r.delete(
    "/:id",
    authRequired,
    requireRole(UserRole.ADMIN),
    asyncHandler(c.adminDelete)
  );

  return r;
}
