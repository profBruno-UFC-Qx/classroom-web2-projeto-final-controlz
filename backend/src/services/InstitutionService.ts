import { AppDataSource } from "../data-source";
import { Institution } from "../entities/Institution";
import { User } from "../entities/User";
import { InstitutionStatus, UserRole } from "../entities/enums";
import { HttpError } from "../http/httpErrors";

type UpsertInstitutionInput = {
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
};

export class InstitutionService {
  private institutionRepo = AppDataSource.getRepository(Institution);
  private userRepo = AppDataSource.getRepository(User);

  async getMyInstitution(userId: string) {
    return await this.institutionRepo.findOne({ where: { userId } });
  }

  async upsertMyInstitution(userId: string, input: UpsertInstitutionInput) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    if (user.role !== UserRole.INSTITUTION) throw new HttpError(403, "Apenas instituição");

    const existing = await this.institutionRepo.findOne({ where: { userId } });

    if (existing) {
      existing.name = input.name.trim();
      existing.description = input.description ?? null;
      existing.address = input.address ?? null;
      existing.city = input.city ?? null;
      // manter status/review
      return await this.institutionRepo.save(existing);
    }

    const created = this.institutionRepo.create({
      userId,
      name: input.name.trim(),
      description: input.description ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      status: InstitutionStatus.PENDING,
    });

    return await this.institutionRepo.save(created);
  }

  async adminList(params: { status?: InstitutionStatus; page?: number; limit?: number }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;

    const qb = this.institutionRepo.createQueryBuilder("i");
    if (params.status) qb.where("i.status = :status", { status: params.status });

    qb.orderBy("i.createdAt", "DESC").skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async adminReviewInstitution(
    institutionId: string,
    reviewerUserId: string,
    status: InstitutionStatus.APPROVED | InstitutionStatus.REJECTED,
  ) {
    const inst = await this.institutionRepo.findOne({ where: { id: institutionId } });
    if (!inst) throw new HttpError(404, "Instituição não encontrada");
    inst.status = status;
    inst.reviewedByUserId = reviewerUserId;
    return await this.institutionRepo.save(inst);
  }
}



