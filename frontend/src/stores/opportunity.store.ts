import { defineStore } from "pinia";
import { http } from "../services/http";

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

export const useOpportunityStore = defineStore("opportunity", {
  state: () => ({
    currentOpportunity: null as Opportunity | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // ✅ Agora apenas busca e RETORNA (não armazena lista completa)
    async list(query: OpportunityListQuery = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await http.get<PaginatedResponse<Opportunity>>(
          "/opportunities",
          { params: query }
        );

        return response.data;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao carregar oportunidades";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Mantive como estava, mas recomendo endpoint GET /opportunities/:id no futuro
    async getById(id: string) {
      if (this.currentOpportunity?.id === id) return this.currentOpportunity;

      // fallback não escalável: tenta achar buscando uma página maior
      this.loading = true;
      this.error = null;
      try {
        const response = await http.get<PaginatedResponse<Opportunity>>(
          "/opportunities",
          { params: { limit: 50, page: 1 } }
        );

        const found = response.data.data.find((o) => o.id === id);
        if (!found) throw new Error("Oportunidade não encontrada");

        this.currentOpportunity = found;
        return found;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao carregar oportunidade";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async create(data: {
      title: string;
      description: string;
      category?: string | null;
      city?: string | null;
      workloadHours?: number;
      isActive?: boolean;
    }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.post<{ opportunity: Opportunity }>(
          "/opportunities",
          data
        );
        return response.data.opportunity;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao criar oportunidade";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async update(
      id: string,
      data: {
        title?: string;
        description?: string;
        category?: string | null;
        city?: string | null;
        workloadHours?: number;
        isActive?: boolean;
      }
    ) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.put<{ opportunity: Opportunity }>(
          `/opportunities/${id}`,
          data
        );

        if (this.currentOpportunity?.id === id) {
          this.currentOpportunity = response.data.opportunity;
        }

        return response.data.opportunity;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao atualizar oportunidade";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async delete(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await http.delete(`/opportunities/${id}`);
        if (this.currentOpportunity?.id === id) {
          this.currentOpportunity = null;
        }
        return true;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao deletar oportunidade";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearCurrent() {
      this.currentOpportunity = null;
    },
  },
});
