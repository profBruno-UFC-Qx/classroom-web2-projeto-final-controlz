import { Router } from "express";
import { OpportunityController } from "../controllers/OpportunityController";
import { OpportunityManageController } from "../controllers/OpportunityManageController";
import { asyncHandler } from "../http/asyncHandler";
import { authRequired, requireRole } from "../auth/authMiddleware";
import { UserRole } from "../entities/enums";

export function opportunityRoutes() {
  const r = Router();
  const c = new OpportunityController();
  const m = new OpportunityManageController();

  // area publica
  r.get("/", asyncHandler(c.listPublic));

  // area restrita
  r.post("/", authRequired, requireRole(UserRole.ADMIN, UserRole.INSTITUTION), asyncHandler(m.create));
  r.put("/:id", authRequired, requireRole(UserRole.ADMIN, UserRole.INSTITUTION), asyncHandler(m.update));
  r.delete("/:id", authRequired, requireRole(UserRole.ADMIN, UserRole.INSTITUTION), asyncHandler(m.remove));

  return r;
}



