import { defineStore } from "pinia";
import { http } from "../services/http";

export type UserRole = "admin" | "instituicao" | "aluno";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

type RegisterResponse = {
  user: AuthUser;
  accessToken: string;
};

type MeResponse = {
  user: AuthUser;
};

export const useAuthStore = defineStore("auth", {
  state: () => {
    const token = localStorage.getItem("cv_token");
    const userStr = localStorage.getItem("cv_user");

    return {
      token: token as string | null,
      user: userStr ? (JSON.parse(userStr) as AuthUser) : null,
      loading: false,
      error: null as string | null,
    };
  },
  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.role ?? null,
  },
  actions: {
    setAuth(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      this.error = null;
      localStorage.setItem("cv_token", token);
      localStorage.setItem("cv_user", JSON.stringify(user));
    },
    loadFromStorage() {
      const token = localStorage.getItem("cv_token");
      const userStr = localStorage.getItem("cv_user");
      this.token = token;
      this.user = userStr ? (JSON.parse(userStr) as AuthUser) : null;
    },
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.post<LoginResponse>("/auth/login", {
          email,
          password,
        });
        this.setAuth(response.data.accessToken, response.data.user);
        return response.data;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async register(name: string, email: string, password: string, role: "aluno" | "instituicao") {
      this.loading = true;
      this.error = null;
      try {
        const response = await http.post<RegisterResponse>("/auth/register", {
          name,
          email,
          password,
          role,
        });
        this.setAuth(response.data.accessToken, response.data.user);
        return response.data;
      } catch (err: any) {
        this.error =
          err?.response?.data?.message || "Erro ao fazer cadastro. Tente novamente.";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async checkAuth() {
      if (!this.token) return null;
      try {
        const response = await http.get<MeResponse>("/auth/me");
        this.user = response.data.user;
        localStorage.setItem("cv_user", JSON.stringify(response.data.user));
        return response.data.user;
      } catch (err: any) {
        // token inválido ou expirado
        this.logout();
        return null;
      }
    },
    async logout() {
      try {
        await http.post("/auth/logout");
      } catch (err) {
        // ignora erros no logout
      } finally {
        this.token = null;
        this.user = null;
        this.error = null;
        localStorage.removeItem("cv_token");
        localStorage.removeItem("cv_user");
      }
    },
    // Mock (mantido para testes durante desenvolvimento)
    loginMock(role: UserRole) {
      this.setAuth("mock-token", {
        id: "1",
        name: "Usuário Demo",
        email: "demo@demo.com",
        role,
      });
    },
  },
});
