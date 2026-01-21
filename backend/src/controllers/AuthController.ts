import type { Request, Response } from "express";
import { UserRole } from "../entities/enums";
import { HttpError } from "../http/httpErrors";
import { AuthService } from "../services/AuthService";

// Controller de autenticacao que delega logica para AuthService
export class AuthController {
  private authService = new AuthService();

  // Cadastro de novos usuarios (apenas STUDENT ou INSTITUTION)
  register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body ?? {};

    // Valida campos obrigatorios
    if (!name || !email || !password || !role) {
      throw new HttpError(
        400,
        "Campos obrigatórios: name, email, password, role"
      );
    }
    // Apenas alunos e instituicoes podem se auto-registrar
    if (role !== UserRole.STUDENT && role !== UserRole.INSTITUTION) {
      throw new HttpError(400, "Role inválida para cadastro");
    }

    const result = await this.authService.register({
      name,
      email,
      password,
      role,
    });
    return res.status(201).json(result);
  };

  // Login com email e senha, retorna token JWT
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password)
      throw new HttpError(400, "Campos obrigatórios: email, password");
    const result = await this.authService.login(email, password);
    return res.json(result);
  };

  // Retorna dados do usuario autenticado
  me = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const user = await this.authService.me(req.user.id);
    return res.json({ user });
  };

  // Logout stateless: apenas confirma no backend, frontend descarta o token
  logout = async (_req: Request, res: Response) => {
    // JWT e stateless: no backend apenas respondemos OK
    // no front basta descartar o token
    return res.json({ ok: true });
  };
}
