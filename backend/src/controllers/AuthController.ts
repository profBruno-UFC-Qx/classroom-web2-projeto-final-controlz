import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { HttpError } from "../http/httpErrors";
import { UserRole } from "../entities/enums";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body ?? {};

    if (!name || !email || !password || !role) {
      throw new HttpError(400, "Campos obrigatórios: name, email, password, role");
    }
    if (role !== UserRole.STUDENT && role !== UserRole.INSTITUTION) {
      throw new HttpError(400, "Role inválida para cadastro");
    }

    const result = await this.authService.register({ name, email, password, role });
    return res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) throw new HttpError(400, "Campos obrigatórios: email, password");
    const result = await this.authService.login(email, password);
    return res.json(result);
  };

  me = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const user = await this.authService.me(req.user.id);
    return res.json({ user });
  };

  logout = async (_req: Request, res: Response) => {
    // JWT e stateless: no backend apenas respondemos OK
    // no front basta descartar o token
    return res.json({ ok: true });
  };
}



