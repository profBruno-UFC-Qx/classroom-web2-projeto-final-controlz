import type { Request, Response } from "express";
import { HttpError } from "../http/httpErrors";
import { InstitutionService } from "../services/InstitutionService";
import { InstitutionStatus } from "../entities/enums";

export class InstitutionController {
  private service = new InstitutionService();

  getMe = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const inst = await this.service.getMyInstitution(req.user.id);
    return res.json({ institution: inst });
  };

  upsertMe = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { name, description, address, city } = req.body ?? {};
    if (!name) throw new HttpError(400, "Campo obrigatório: name");
    const inst = await this.service.upsertMyInstitution(req.user.id, {
      name,
      description: description ?? null,
      address: address ?? null,
      city: city ?? null,
    });
    return res.status(201).json({ institution: inst });
  };

  adminList = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const statusRaw = typeof req.query.status === "string" ? req.query.status : undefined;

    const status =
      statusRaw && Object.values(InstitutionStatus).includes(statusRaw as InstitutionStatus)
        ? (statusRaw as InstitutionStatus)
        : undefined;

    const result = await this.service.adminList({
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      status,
    });
    return res.json(result);
  };

  adminApprove = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { id } = req.params;
    const inst = await this.service.adminReviewInstitution(
      id,
      req.user.id,
      InstitutionStatus.APPROVED,
    );
    return res.json({ institution: inst });
  };

  adminReject = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { id } = req.params;
    const inst = await this.service.adminReviewInstitution(
      id,
      req.user.id,
      InstitutionStatus.REJECTED,
    );
    return res.json({ institution: inst });
  };
}



