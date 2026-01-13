<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth.store";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref<"aluno" | "instituicao">("aluno");
const error = ref("");

function getDashboardRoute(role: string) {
  if (role === "aluno") return "/app/student/dashboard";
  if (role === "instituicao") return "/app/institution/dashboard";
  return "/";
}

function validateForm() {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = "Preencha todos os campos";
    return false;
  }

  if (password.value.length < 6) {
    error.value = "A senha deve ter pelo menos 6 caracteres";
    return false;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "As senhas não coincidem";
    return false;
  }

  return true;
}

async function handleSubmit() {
  error.value = "";

  if (!validateForm()) {
    return;
  }

  try {
    await auth.register(name.value, email.value, password.value, role.value);
    const route = getDashboardRoute(auth.role || "");
    router.push(route);
  } catch (err: any) {
    error.value = auth.error || "Erro ao fazer cadastro. Tente novamente.";
  }
}
</script>

<template>
  <div style="max-width: 480px">
    <h2 style="margin: 0 0 8px">Criar Conta</h2>
    <p style="opacity: 0.75; margin: 0 0 20px">Cadastre-se para começar a usar a plataforma</p>

    <form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 12px">
      <div v-if="error" style="padding: 12px; background: #fee; border: 1px solid #fcc; border-radius: 8px; color: #c33">
        {{ error }}
      </div>

      <div>
        <label style="display: block; font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          Nome completo *
        </label>
        <input
          v-model="name"
          type="text"
          required
          placeholder="Seu nome"
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
          Tipo de conta *
        </label>
        <div style="display: flex; gap: 8px">
          <label
            :class="{ 'role-selected': role === 'aluno' }"
            class="role-button"
            @click="role = 'aluno'"
          >
            <input
              v-model="role"
              type="radio"
              value="aluno"
              style="display: none"
            />
            <span style="font-weight: 600">👨‍🎓 Aluno</span>
          </label>
          <label
            :class="{ 'role-selected': role === 'instituicao' }"
            class="role-button"
            @click="role = 'instituicao'"
          >
            <input
              v-model="role"
              type="radio"
              value="instituicao"
              style="display: none"
            />
            <span style="font-weight: 600">🏢 Instituição</span>
          </label>
        </div>
      </div>

      <div>
        <label style="display: block; font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          Senha *
        </label>
        <input
          v-model="password"
          type="password"
          required
          placeholder="Mínimo 6 caracteres"
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
          Confirmar senha *
        </label>
        <input
          v-model="confirmPassword"
          type="password"
          required
          placeholder="Digite a senha novamente"
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
        {{ auth.loading ? "Criando conta..." : "Criar conta" }}
      </button>
    </form>

    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb">
      <p style="font-size: 13px; opacity: 0.75; margin: 0 0 8px">Já tem uma conta?</p>
      <RouterLink
        to="/login"
        style="
          display: inline-block;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
        "
      >
        Fazer login
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.role-button {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  background: #fff;
  color: #111827;
  transition: all 0.2s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.role-button:hover {
  border-color: #111827;
  background: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.role-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.role-selected {
  background: #111827 !important;
  color: #fff !important;
  border-color: #111827 !important;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.2);
}

.role-selected:hover {
  background: #1f2937 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.3);
}

.role-selected::before {
  content: "✓";
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: bold;
}
</style>
