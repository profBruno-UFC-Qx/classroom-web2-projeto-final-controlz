<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth.store";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

function getDashboardRoute(role: string) {
  if (role === "aluno") return "/app/student/dashboard";
  if (role === "instituicao") return "/app/institution/dashboard";
  if (role === "admin") return "/app/admin/dashboard";
  return "/";
}

async function handleSubmit() {
  error.value = "";
  if (!email.value || !password.value) {
    error.value = "Preencha todos os campos";
    return;
  }

  try {
    await auth.login(email.value, password.value);
    const route = getDashboardRoute(auth.role || "");
    router.push(route);
  } catch (err: any) {
    error.value = auth.error || "Erro ao fazer login. Tente novamente.";
  }
}
</script>

<template>
  <div style="max-width: 420px">
    <h2 style="margin: 0 0 8px">Entrar</h2>
    <p style="opacity: 0.75; margin: 0 0 20px">Faça login para acessar sua conta</p>

    <form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 12px">
      <div v-if="error" style="padding: 12px; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33">
        {{ error }}
      </div>

      <div>
        <label style="display: block; font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          E-mail *
        </label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="seu@email.com"
          style="
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            box-sizing: border-box;
          "
        />
      </div>

      <div>
        <label style="display: block; font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          Senha *
        </label>
        <input
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          style="
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            box-sizing: border-box;
          "
        />
      </div>

      <button
        type="submit"
        :disabled="auth.loading"
        style="
          padding: 12px 16px;
          border: 1px solid #111827;
          border-radius: 10px;
          background: #111827;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
          margin-top: 8px;
        "
      >
        {{ auth.loading ? "Entrando..." : "Entrar" }}
      </button>
    </form>

    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb">
      <p style="font-size: 13px; opacity: 0.75; margin: 0 0 8px">Não tem uma conta?</p>
      <RouterLink
        to="/cadastro"
        style="
          display: inline-block;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
        "
      >
        Criar conta
      </RouterLink>
    </div>
  </div>
</template>