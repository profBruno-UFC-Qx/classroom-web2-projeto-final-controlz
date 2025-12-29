import type { Request, Response } from "express";
import { HttpError } from "../http/httpErrors";
import { UserRole } from "../entities/enums";
import { UserService } from "../services/UserService";

export class UserController {
  private service = new UserService();

  // admin
  adminList = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const email = typeof req.query.email === "string" ? req.query.email : undefined;
    const roleRaw = typeof req.query.role === "string" ? req.query.role : undefined;

    const role =
      roleRaw && Object.values(UserRole).includes(roleRaw as UserRole) ? (roleRaw as UserRole) : undefined;

    const result = await this.service.adminList({
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      email,
      role,
    });
    return res.json(result);
  };

  adminGet = async (req: Request, res: Response) => {
    const user = await this.service.adminGetById(req.params.id);
    return res.json({ user });
  };

  adminCreate = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body ?? {};
    if (!name || !email || !password || !role) {
      throw new HttpError(400, "Campos obrigatórios: name, email, password, role");
    }
    if (!Object.values(UserRole).includes(role as UserRole)) throw new HttpError(400, "Role inválida");

    const user = await this.service.adminCreate({ name, email, password, role });
    return res.status(201).json({ user });
  };

  adminUpdate = async (req: Request, res: Response) => {
    const user = await this.service.adminUpdate(req.params.id, req.body ?? {});
    return res.json({ user });
  };

  adminDelete = async (req: Request, res: Response) => {
    const result = await this.service.adminDelete(req.params.id);
    return res.json(result);
  };

  // comum (somente próprio)
  me = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const user = await this.service.getMe(req.user.id);
    return res.json({ user });
  };

  updateMe = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const user = await this.service.updateMe(req.user.id, req.body ?? {});
    return res.json({ user });
  };

  deleteMe = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const result = await this.service.deleteMe(req.user.id);
    return res.json(result);
  };
}


