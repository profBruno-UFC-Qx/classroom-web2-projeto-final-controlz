import type { Request, Response } from "express";
import { HttpError } from "../http/httpErrors";
import { OpportunityManageService } from "../services/OpportunityManageService";

export class OpportunityManageController {
  private service = new OpportunityManageService();

  create = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { institutionId, title, description, category, city, workloadHours, isActive } = req.body ?? {};
    if (!title || !description) throw new HttpError(400, "Campos obrigatórios: title, description");

    const opp = await this.service.create(req.user, {
      institutionId,
      title,
      description,
      category: category ?? null,
      city: city ?? null,
      workloadHours: typeof workloadHours === "number" ? workloadHours : undefined,
      isActive: typeof isActive === "boolean" ? isActive : undefined,
    });

    return res.status(201).json({ opportunity: opp });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { id } = req.params;
    const opp = await this.service.update(req.user, id, req.body ?? {});
    return res.json({ opportunity: opp });
  };

  remove = async (req: Request, res: Response) => {
    if (!req.user) throw new HttpError(401, "Não autenticado");
    const { id } = req.params;
    const result = await this.service.remove(req.user, id);
    return res.json(result);
  };
}



