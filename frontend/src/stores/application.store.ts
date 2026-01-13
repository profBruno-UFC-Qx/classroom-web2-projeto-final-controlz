import { defineStore } from "pinia";
import { http } from "../services/http";

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed";

export type Application = {
  id: string;
  studentId: string;
  opportunityId: string;
  status: ApplicationStatus;
  institutionDocumentUrl?: string | null;
  studentSignedDocumentUrl?: string | null;
  finalDocumentUrl?: string | null;
  certificateUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  // relações (podem vir do backend)
  student?: { id: string; name: string; email: string };
  opportunity?: {
    id: string;
    title: string;
    institutionId: string;
    institution?: { name: string };
  };
};

export type ApplicationListQuery = {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  opportunityId?: string;
  studentId?: string;
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

export const useApplicationStore = defineStore("application", {
  state: () => ({
    applications: [] as Application[],
    currentApplication: null as Application | null,
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
    // lista candidaturas do aluno autenticado
    async listMyApplications(query: ApplicationListQuery = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.get<PaginatedResponse<Application>>("/applications/me", {
          params: query,
        });
        this.applications = response.data.data;
        this.pagination = response.data.meta;
        return response.data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao carregar candidaturas";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // lista candidaturas para instituição (gerenciamento)
    async listInstitutionApplications(query: ApplicationListQuery = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.get<PaginatedResponse<Application>>("/applications/institution", {
          params: query,
        });
        this.applications = response.data.data;
        this.pagination = response.data.meta;
        return response.data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao carregar candidaturas";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // candidatar-se a uma oportunidade
    async apply(opportunityId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.post<{ application: Application }>("/applications", {
          opportunityId,
        });
        // adiciona à lista se necessário
        this.applications.unshift(response.data.application);
        return response.data.application;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao se candidatar";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // atualizar status de candidatura (admin/instituição)
    async updateStatus(applicationId: string, status: ApplicationStatus) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.patch<{ application: Application }>(
          `/applications/${applicationId}/status`,
          { status }
        );
        // atualiza na lista
        const index = this.applications.findIndex((a) => a.id === applicationId);
        if (index !== -1) {
          this.applications[index] = response.data.application;
        }
        if (this.currentApplication?.id === applicationId) {
          this.currentApplication = response.data.application;
        }
        return response.data.application;
      } catch (err: any) {
        this.error = err?.response?.data?.message || "Erro ao atualizar status";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    clearCurrent() {
      this.currentApplication = null;
    },
  },
});
