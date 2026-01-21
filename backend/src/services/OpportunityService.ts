import { AppDataSource } from "../data-source";
import { VolunteerOpportunity } from "../entities/VolunteerOpportunity";

export type OpportunityListQuery = {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  institutionId?: string;
  isActive?: boolean;
  q?: string;
};

export class OpportunityService {
  private repo = AppDataSource.getRepository(VolunteerOpportunity);

  async listPublic(query: OpportunityListQuery) {
    const currentPage = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const skip = (currentPage - 1) * limit;

    const qb = this.repo
      .createQueryBuilder("o")
      .where("o.isActive = :isActive", {
        isActive: query.isActive ?? true,
      });

    if (query.category) {
      qb.andWhere("LOWER(o.category) = LOWER(:category)", {
        category: query.category,
      });
    }

    if (query.city) {
      qb.andWhere("LOWER(o.city) = LOWER(:city)", { city: query.city });
    }

    if (query.institutionId) {
      qb.andWhere("o.institutionId = :institutionId", {
        institutionId: query.institutionId,
      });
    }

    if (query.q) {
      qb.andWhere("(o.title LIKE :search OR o.description LIKE :search)", {
        search: `%${query.q}%`,
      });
    }

    qb.orderBy("o.createdAt", "DESC").skip(skip).take(limit);

    const [data, totalItems] = await qb.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data,
      meta: {
        totalItems,
        totalPages,
        currentPage,
        limit,
      },
    };
  }
}
