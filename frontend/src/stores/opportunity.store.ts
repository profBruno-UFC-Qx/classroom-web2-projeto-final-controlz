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

export const useOpportunityStore = defineStore("opportunity", {
  state: () => ({
    opportunities: [] as Opportunity[],
    currentOpportunity: null as Opportunity | null,
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
    async list(query: OpportunityListQuery = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.get<PaginatedResponse<Opportunity>>("/opportunities", {
          params: query,
        });
        this.opportunities = response.data.data;
        this.pagination = response.data.meta;
        return response.data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao carregar oportunidades";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getById(id: string) {
      // como não tem um endpoint específico, vamos buscar da lista e filtrar
      // ou usar a lista atual se já tiver carregado
      const existing = this.opportunities.find((o) => o.id === id);
      if (existing) {
        this.currentOpportunity = existing;
        return existing;
      }

      // se não encontrar, busca na lista
      this.loading = true;
      this.error = null;
      try {
        const response = await http.get<PaginatedResponse<Opportunity>>("/opportunities", {
          params: { limit: 100 }, // buscar mais para encontrar o item
        });
        const found = response.data.data.find((o) => o.id === id);
        if (found) {
          this.currentOpportunity = found;
          return found;
        }
        throw new Error("Oportunidade não encontrada");
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao carregar oportunidade";
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
        const response = await http.post<{ opportunity: Opportunity }>("/opportunities", data);
        // adiciona na lista se necessário
        this.opportunities.unshift(response.data.opportunity);
        return response.data.opportunity;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao criar oportunidade";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async update(id: string, data: {
      title?: string;
      description?: string;
      category?: string | null;
      city?: string | null;
      workloadHours?: number;
      isActive?: boolean;
    }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.put<{ opportunity: Opportunity }>(`/opportunities/${id}`, data);
        // atualiza na lista
        const index = this.opportunities.findIndex((o) => o.id === id);
        if (index !== -1) {
          this.opportunities[index] = response.data.opportunity;
        }
        if (this.currentOpportunity?.id === id) {
          this.currentOpportunity = response.data.opportunity;
        }
        return response.data.opportunity;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao atualizar oportunidade";
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
        // remove da lista
        this.opportunities = this.opportunities.filter((o) => o.id !== id);
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
