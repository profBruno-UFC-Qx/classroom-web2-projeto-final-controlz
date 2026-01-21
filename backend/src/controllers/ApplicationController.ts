import type { Request, Response } from "express";
import { ApplicationStatus } from "../entities/enums";
import { HttpError } from "../http/httpErrors";
import { ApplicationService } from "../services/ApplicationService";

// Controller de aplicacoes com fluxos separados por papel
export class ApplicationController {
  private service = new ApplicationService();

  // === FLUXO DO ALUNO ===

  // Aluno se candidata a uma oportunidade
  studentApply = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { opportunityId } = req.body ?? {};
    if (!opportunityId)
      throw new HttpError(400, "Campo obrigatório: opportunityId");
    const app = await this.service.studentApply(req.user.id, opportunityId);
    return res.status(201).json({ application: app });
  };

  // Aluno lista suas proprias candidaturas com filtros opcionais
  studentMyList = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const statusRaw =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const status =
      statusRaw &&
      Object.values(ApplicationStatus).includes(statusRaw as ApplicationStatus)
        ? (statusRaw as ApplicationStatus)
        : undefined;

    const result = await this.service.studentListMyApplications(req.user.id, {
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      status,
      opportunityId:
        typeof req.query.opportunityId === "string"
          ? req.query.opportunityId
          : undefined,
    });
    return res.json(result);
  };

  // === FLUXO DA INSTITUICAO ===

  // Instituicao lista candidaturas recebidas em suas oportunidades
  institutionList = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const statusRaw =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const status =
      statusRaw &&
      Object.values(ApplicationStatus).includes(statusRaw as ApplicationStatus)
        ? (statusRaw as ApplicationStatus)
        : undefined;

    const result = await this.service.institutionListApplications(req.user.id, {
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      status,
      opportunityId:
        typeof req.query.opportunityId === "string"
          ? req.query.opportunityId
          : undefined,
      studentId:
        typeof req.query.studentId === "string"
          ? req.query.studentId
          : undefined,
    });

    return res.json(result);
  };

  // === FLUXO DO ADMIN ===

  // Admin lista todas as candidaturas do sistema com filtros
  adminList = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const statusRaw =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const status =
      statusRaw &&
      Object.values(ApplicationStatus).includes(statusRaw as ApplicationStatus)
        ? (statusRaw as ApplicationStatus)
        : undefined;

    const result = await this.service.adminList({
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      status,
      opportunityId:
        typeof req.query.opportunityId === "string"
          ? req.query.opportunityId
          : undefined,
      studentId:
        typeof req.query.studentId === "string"
          ? req.query.studentId
          : undefined,
    });
    return res.json(result);
  };

  // === MODERACAO ===

  // Admin ou instituicao alteram status de uma candidatura
  setStatus = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { id } = req.params;
    const { status } = req.body ?? {};
    if (!status) throw new HttpError(400, "Campo obrigatório: status");
    if (
      !Object.values(ApplicationStatus).includes(status as ApplicationStatus)
    ) {
      throw new HttpError(400, "Status inválido");
    }
    const app = await this.service.setStatus(
      req.user,
      id,
      status as ApplicationStatus
    );
    return res.json({ application: app });
  };
}
