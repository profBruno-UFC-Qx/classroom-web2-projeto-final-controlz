import { defineStore } from "pinia";
import type {
  CreateOpportunityDTO,
  Opportunity,
  OpportunityListQuery,
  UpdateOpportunityDTO,
} from "../services/opportunityService";
import * as opportunityService from "../services/opportunityService";

export const useOpportunityStore = defineStore("opportunity", {
  state: () => ({
    currentOpportunity: null as Opportunity | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async list(query: OpportunityListQuery = {}) {
      this.loading = true;
      this.error = null;

      try {
        return await opportunityService.fetchOpportunities(query);
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao carregar oportunidades";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getById(id: string) {
      if (this.currentOpportunity?.id === id) return this.currentOpportunity;

      this.loading = true;
      this.error = null;
      try {
        const opportunity = await opportunityService.getOpportunityById(id);
        this.currentOpportunity = opportunity;
        return opportunity;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao carregar oportunidade";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async create(data: CreateOpportunityDTO) {
      this.loading = true;
      this.error = null;
      try {
        return await opportunityService.createOpportunity(data);
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao criar oportunidade";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async update(id: string, data: UpdateOpportunityDTO) {
      this.loading = true;
      this.error = null;
      try {
        const opportunity = await opportunityService.updateOpportunity(id, data);

        if (this.currentOpportunity?.id === id) {
          this.currentOpportunity = opportunity;
        }

        return opportunity;
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
        await opportunityService.deleteOpportunity(id);

        if (this.currentOpportunity?.id === id) {
          this.currentOpportunity = null;
        }

        return true;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao deletar oportunidade";
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
