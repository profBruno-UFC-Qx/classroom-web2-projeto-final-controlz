import { defineStore } from "pinia";
import { http } from "../services/http";

export type InstitutionStatus = "pending" | "approved" | "rejected";

export type Institution = {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  status: InstitutionStatus;
  reviewedByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InstitutionListQuery = {
  page?: number;
  limit?: number;
  status?: InstitutionStatus;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UpsertInstitutionInput = {
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
};

export const useInstitutionStore = defineStore("institution", {
  state: () => ({
    institutions: [] as Institution[],
    currentInstitution: null as Institution | null,
    loading: false,
    error: null as string | null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  }),

  actions: {
    // Buscar dados da própria instituição
    async getMe() {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.get<{ institution: Institution }>("/institutions/me");
        this.currentInstitution = response.data.institution;
        return response.data.institution;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao carregar instituição";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Criar/atualizar dados da própria instituição
    async upsertMe(input: UpsertInstitutionInput) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.put<{ institution: Institution }>("/institutions/me", input);
        this.currentInstitution = response.data.institution;
        return response.data.institution;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao salvar instituição";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Lista de instituições (admin)
    async list(query: InstitutionListQuery = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.get<PaginatedResponse<Institution>>("/institutions", {
          params: query,
        });
        this.institutions = response.data.data;
        this.pagination = response.data.meta;
        return response.data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao carregar instituições";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Aprovar instituição (admin)
    async approve(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.post<{ institution: Institution }>(`/institutions/${id}/approve`);
        // Atualiza na lista
        const index = this.institutions.findIndex((i) => i.id === id);
        if (index !== -1) {
          this.institutions[index] = response.data.institution;
        }
        return response.data.institution;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao aprovar instituição";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Rejeitar instituição (admin)
    async reject(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.post<{ institution: Institution }>(`/institutions/${id}/reject`);
        // Atualiza na lista
        const index = this.institutions.findIndex((i) => i.id === id);
        if (index !== -1) {
          this.institutions[index] = response.data.institution;
        }
        return response.data.institution;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao rejeitar instituição";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearCurrent() {
      this.currentInstitution = null;
    },
  },
});
