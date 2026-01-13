import { defineStore } from "pinia";

export type UserRole = "admin" | "instituicao" | "aluno";

export type AuthUser = {
id: string | number;
name: string;
email: string;
role: UserRole;
};

export const useAuthStore = defineStore("auth", {
    state: () => {
        const token = localStorage.getItem("cv_token");
        const userStr = localStorage.getItem("cv_user");
    
        return {
        token: token as string | null,
        user: userStr ? (JSON.parse(userStr) as AuthUser) : null,
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
    localStorage.setItem("cv_token", token);
    localStorage.setItem("cv_user", JSON.stringify(user));
    },
    loadFromStorage() {
    const token = localStorage.getItem("cv_token");
    const userStr = localStorage.getItem("cv_user");
    this.token = token;
    this.user = userStr ? (JSON.parse(userStr) as AuthUser) : null;
    },
    logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("cv_token");
    localStorage.removeItem("cv_user");
    },

    // TODO: remover loginMock e implementar autenticação real
    // - criar action login(email, password) que chama POST /auth/login
    // - criar action register(name, email, password, role) que chama POST /auth/register
    // - criar action logout() que chama POST /auth/logout (se necessário)
    // - criar action checkAuth() que chama GET /auth/me para verificar token
    // - atualizar setAuth para usar dados reais da API
    // Mock
    loginMock(role: UserRole) {
    this.setAuth("mock-token", {
        id: 1,
        name: "Usuário Demo",
        email: "demo@demo.com",
        role,
    });
    },
},
});
