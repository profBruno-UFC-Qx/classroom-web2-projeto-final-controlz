import { AppDataSource } from "../data-source";
import { Institution } from "../entities/Institution";
import { InstitutionStatus, UserRole } from "../entities/enums";
import { VolunteerOpportunity } from "../entities/VolunteerOpportunity";
import { HttpError } from "../http/httpErrors";

type CreateOpportunityInput = {
  // admin pode informar; instituição ignora
  institutionId?: string;
  title: string;
  description: string;
  category?: string | null;
  city?: string | null;
  workloadHours?: number;
  isActive?: boolean;
};

type UpdateOpportunityInput = Partial<CreateOpportunityInput>;

export class OpportunityManageService {
  private oppRepo = AppDataSource.getRepository(VolunteerOpportunity);
  private instRepo = AppDataSource.getRepository(Institution);

  private async resolveInstitutionIdForUser(userId: string) {
    const inst = await this.instRepo.findOne({ where: { userId } });
    if (!inst) throw new HttpError(400, "Instituição ainda não cadastrou o perfil");
    if (inst.status !== InstitutionStatus.APPROVED) {
      throw new HttpError(403, "Instituição ainda não aprovada pelo admin");
    }
    return inst.id;
  }

  async create(user: { id: string; role: UserRole }, input: CreateOpportunityInput) {
    let institutionId: string | undefined = input.institutionId;

    if (user.role === UserRole.INSTITUTION) {
      institutionId = await this.resolveInstitutionIdForUser(user.id);
    }

    if (user.role === UserRole.ADMIN) {
      if (!institutionId) throw new HttpError(400, "Campo obrigatório para admin: institutionId");
    }

    if (!institutionId) throw new HttpError(400, "institutionId inválido");

    const opp = this.oppRepo.create({
      institutionId,
      title: input.title.trim(),
      description: input.description,
      category: input.category ?? null,
      city: input.city ?? null,
      workloadHours: input.workloadHours ?? 0,
      isActive: input.isActive ?? true,
    });

    return await this.oppRepo.save(opp);
  }

  async update(user: { id: string; role: UserRole }, opportunityId: string, input: UpdateOpportunityInput) {
    const opp = await this.oppRepo.findOne({ where: { id: opportunityId } });
    if (!opp) throw new HttpError(404, "Oportunidade não encontrada");

    if (user.role === UserRole.INSTITUTION) {
      const myInstitutionId = await this.resolveInstitutionIdForUser(user.id);
      if (opp.institutionId !== myInstitutionId) throw new HttpError(403, "Sem permissão");
    }

    // admin pode tudo
    if (typeof input.title === "string") opp.title = input.title.trim();
    if (typeof input.description === "string") opp.description = input.description;
    if (input.category !== undefined) opp.category = input.category ?? null;
    if (input.city !== undefined) opp.city = input.city ?? null;
    if (typeof input.workloadHours === "number") opp.workloadHours = input.workloadHours;
    if (typeof input.isActive === "boolean") opp.isActive = input.isActive;

    return await this.oppRepo.save(opp);
  }

  async remove(user: { id: string; role: UserRole }, opportunityId: string) {
    const opp = await this.oppRepo.findOne({ where: { id: opportunityId } });
    if (!opp) throw new HttpError(404, "Oportunidade não encontrada");

    if (user.role === UserRole.INSTITUTION) {
      const myInstitutionId = await this.resolveInstitutionIdForUser(user.id);
      if (opp.institutionId !== myInstitutionId) throw new HttpError(403, "Sem permissão");
    }

    await this.oppRepo.delete({ id: opportunityId });
    return { ok: true };
  }
}



