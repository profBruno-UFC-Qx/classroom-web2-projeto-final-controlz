import { AppDataSource } from "../data-source";
import { Application } from "../entities/Application";
import { VolunteerOpportunity } from "../entities/VolunteerOpportunity";
import { Institution } from "../entities/Institution";
import { ApplicationStatus, InstitutionStatus, UserRole } from "../entities/enums";
import { HttpError } from "../http/httpErrors";

export type ApplicationListQuery = {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  opportunityId?: string;
  studentId?: string;
};

export class ApplicationService {
  private appRepo = AppDataSource.getRepository(Application);
  private oppRepo = AppDataSource.getRepository(VolunteerOpportunity);
  private instRepo = AppDataSource.getRepository(Institution);

  async studentApply(studentId: string, opportunityId: string) {
    const opp = await this.oppRepo.findOne({ where: { id: opportunityId } });
    if (!opp || !opp.isActive) throw new HttpError(404, "Oportunidade não encontrada");

    // evita duplicar (Unique constraint também protege)
    const existing = await this.appRepo.findOne({ where: { studentId, opportunityId } });
    if (existing) throw new HttpError(409, "Você já se candidatou a esta oportunidade");

    const app = this.appRepo.create({
      studentId,
      opportunityId,
      status: ApplicationStatus.PENDING,
    });
    return await this.appRepo.save(app);
  }

  async studentListMyApplications(studentId: string, query: ApplicationListQuery) {
    return await this.listInternal({ ...query, studentId }, { scope: "student" });
  }

  private async resolveApprovedInstitutionIdForUser(userId: string) {
    const inst = await this.instRepo.findOne({ where: { userId } });
    if (!inst) throw new HttpError(400, "Instituição ainda não cadastrou o perfil");
    if (inst.status !== InstitutionStatus.APPROVED) {
      throw new HttpError(403, "Instituição ainda não aprovada pelo admin");
    }
    return inst.id;
  }

  async institutionListApplications(institutionUserId: string, query: ApplicationListQuery) {
    const institutionId = await this.resolveApprovedInstitutionIdForUser(institutionUserId);

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const qb = this.appRepo
      .createQueryBuilder("a")
      .innerJoin(VolunteerOpportunity, "o", "o.id = a.opportunityId")
      .where("o.institutionId = :institutionId", { institutionId });

    if (query.status) qb.andWhere("a.status = :status", { status: query.status });
    if (query.opportunityId) qb.andWhere("a.opportunityId = :opportunityId", { opportunityId: query.opportunityId });
    if (query.studentId) qb.andWhere("a.studentId = :studentId", { studentId: query.studentId });

    qb.orderBy("a.createdAt", "DESC").skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async adminList(query: ApplicationListQuery) {
    return await this.listInternal(query, { scope: "admin" });
  }

  private async listInternal(query: ApplicationListQuery, _opts: { scope: "admin" | "student" }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const qb = this.appRepo.createQueryBuilder("a").where("1=1");

    if (query.status) qb.andWhere("a.status = :status", { status: query.status });
    if (query.opportunityId) qb.andWhere("a.opportunityId = :opportunityId", { opportunityId: query.opportunityId });
    if (query.studentId) qb.andWhere("a.studentId = :studentId", { studentId: query.studentId });

    qb.orderBy("a.createdAt", "DESC").skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async setStatus(
    actor: { id: string; role: UserRole },
    applicationId: string,
    newStatus: ApplicationStatus,
  ) {
    const app = await this.appRepo.findOne({ where: { id: applicationId } });
    if (!app) throw new HttpError(404, "Candidatura não encontrada");

    if (actor.role === UserRole.INSTITUTION) {
      const institutionId = await this.resolveApprovedInstitutionIdForUser(actor.id);
      const opp = await this.oppRepo.findOne({ where: { id: app.opportunityId } });
      if (!opp || opp.institutionId !== institutionId) throw new HttpError(403, "Sem permissão");
    }

    // admin pode tudo; aluno não pode alterar status
    app.status = newStatus;
    return await this.appRepo.save(app);
  }
}



