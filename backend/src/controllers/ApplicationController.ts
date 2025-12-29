import type { Request, Response } from "express";
import { ApplicationService } from "../services/ApplicationService";
import { HttpError } from "../http/httpErrors";
import { ApplicationStatus } from "../entities/enums";

export class ApplicationController {
  private service = new ApplicationService();

  studentApply = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { opportunityId } = req.body ?? {};
    if (!opportunityId) throw new HttpError(400, "Campo obrigatório: opportunityId");
    const app = await this.service.studentApply(req.user.id, opportunityId);
    return res.status(201).json({ application: app });
  };

  studentMyList = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const statusRaw = typeof req.query.status === "string" ? req.query.status : undefined;

    const status =
      statusRaw && Object.values(ApplicationStatus).includes(statusRaw as ApplicationStatus)
        ? (statusRaw as ApplicationStatus)
        : undefined;

    const result = await this.service.studentListMyApplications(req.user.id, {
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      status,
      opportunityId: typeof req.query.opportunityId === "string" ? req.query.opportunityId : undefined,
    });
    return res.json(result);
  };

  institutionList = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const statusRaw = typeof req.query.status === "string" ? req.query.status : undefined;

    const status =
      statusRaw && Object.values(ApplicationStatus).includes(statusRaw as ApplicationStatus)
        ? (statusRaw as ApplicationStatus)
        : undefined;

    const result = await this.service.institutionListApplications(req.user.id, {
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      status,
      opportunityId: typeof req.query.opportunityId === "string" ? req.query.opportunityId : undefined,
      studentId: typeof req.query.studentId === "string" ? req.query.studentId : undefined,
    });

    return res.json(result);
  };

  adminList = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const statusRaw = typeof req.query.status === "string" ? req.query.status : undefined;

    const status =
      statusRaw && Object.values(ApplicationStatus).includes(statusRaw as ApplicationStatus)
        ? (statusRaw as ApplicationStatus)
        : undefined;

    const result = await this.service.adminList({
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      status,
      opportunityId: typeof req.query.opportunityId === "string" ? req.query.opportunityId : undefined,
      studentId: typeof req.query.studentId === "string" ? req.query.studentId : undefined,
    });
    return res.json(result);
  };

  setStatus = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { id } = req.params;
    const { status } = req.body ?? {};
    if (!status) throw new HttpError(400, "Campo obrigatório: status");
    if (!Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      throw new HttpError(400, "Status inválido");
    }
    const app = await this.service.setStatus(req.user, id, status as ApplicationStatus);
    return res.json({ application: app });
  };
}



