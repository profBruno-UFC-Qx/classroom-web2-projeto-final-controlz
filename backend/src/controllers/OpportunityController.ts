import type { Request, Response } from "express";
import { OpportunityService } from "../services/OpportunityService";

// Converte valores de query string para booleano ou undefined
function parseBool(v: unknown): boolean | undefined {
  if (v === undefined || v === null) return undefined;
  if (v === "true" || v === true) return true;
  if (v === "false" || v === false) return false;
  return undefined;
}

// Controller de oportunidades publicas (listagem aberta)
export class OpportunityController {
  private service = new OpportunityService();

  // Lista oportunidades com filtros opcionais e paginacao (acesso publico)
  listPublic = async (req: Request, res: Response) => {
    const pageRaw = req.query.page ? Number(req.query.page) : undefined;
    const limitRaw = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await this.service.listPublic({
      page: Number.isFinite(pageRaw) ? pageRaw : undefined,
      limit: Number.isFinite(limitRaw) ? limitRaw : undefined,
      category:
        typeof req.query.category === "string" ? req.query.category : undefined,
      city: typeof req.query.city === "string" ? req.query.city : undefined,
      institutionId:
        typeof req.query.institutionId === "string"
          ? req.query.institutionId
          : undefined,
      isActive: parseBool(req.query.isActive),
      q: typeof req.query.q === "string" ? req.query.q : undefined,
    });

    return res.json(result);
  };
}
