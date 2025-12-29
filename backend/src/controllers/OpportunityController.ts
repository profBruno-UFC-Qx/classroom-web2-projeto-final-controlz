import type { Request, Response } from "express";
import { OpportunityService } from "../services/OpportunityService";

function parseBool(v: unknown): boolean | undefined {
  if (v === undefined || v === null) return undefined;
  if (v === "true" || v === true) return true;
  if (v === "false" || v === false) return false;
  return undefined;
}

export class OpportunityController {
  private service = new OpportunityService();

  listPublic = async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await this.service.listPublic({
      page: Number.isFinite(page) ? page : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
      category: typeof req.query.category === "string" ? req.query.category : undefined,
      city: typeof req.query.city === "string" ? req.query.city : undefined,
      institutionId: typeof req.query.institutionId === "string" ? req.query.institutionId : undefined,
      isActive: parseBool(req.query.isActive),
    });

    return res.json(result);
  };
}




