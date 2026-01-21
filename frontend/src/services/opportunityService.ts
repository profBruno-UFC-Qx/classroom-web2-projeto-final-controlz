import { http } from "./http";

export type Opportunity = {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  category?: string | null;
  city?: string | null;
  workloadHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OpportunityListQuery = {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  institutionId?: string;
  isActive?: boolean;
  q?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

export type CreateOpportunityDTO = {
  title: string;
  description: string;
  category?: string | null;
  city?: string | null;
  workloadHours?: number;
  isActive?: boolean;
};

export type UpdateOpportunityDTO = {
  title?: string;
  description?: string;
  category?: string | null;
  city?: string | null;
  workloadHours?: number;
  isActive?: boolean;
};

export async function fetchOpportunities(
  query: OpportunityListQuery = {},
): Promise<PaginatedResponse<Opportunity>> {
  const response = await http.get<PaginatedResponse<Opportunity>>(
    "/opportunities",
    { params: query },
  );
  return response.data;
}

export async function getOpportunityById(id: string): Promise<Opportunity> {
  try {
    const res = await http.get<{ opportunity: Opportunity }>(
      `/opportunities/${id}`,
    );
    return res.data.opportunity;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status !== 404) {
        throw err;
    }
  }

  const MAX_PAGES_TO_SCAN = 10;
  const PAGE_LIMIT = 50;

  for (let page = 1; page <= MAX_PAGES_TO_SCAN; page++) {
    const response = await http.get<PaginatedResponse<Opportunity>>(
      "/opportunities",
      { params: { limit: PAGE_LIMIT, page } },
    );

    const found = response.data.data.find((o) => o.id === id);
    if (found) return found;

    if (page >= response.data.meta.totalPages) break;
  }

  throw new Error("Oportunidade não encontrada");
}

export async function createOpportunity(
  data: CreateOpportunityDTO,
): Promise<Opportunity> {
  const response = await http.post<{ opportunity: Opportunity }>(
    "/opportunities",
    data,
  );
  return response.data.opportunity;
}

export async function updateOpportunity(
  id: string,
  data: UpdateOpportunityDTO,
): Promise<Opportunity> {
  const response = await http.put<{ opportunity: Opportunity }>(
    `/opportunities/${id}`,
    data,
  );
  return response.data.opportunity;
}

export async function deleteOpportunity(id: string): Promise<void> {
  await http.delete(`/opportunities/${id}`);
}
