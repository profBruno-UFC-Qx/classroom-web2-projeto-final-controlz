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
  <v-row justify="center">
    <v-col cols="12" sm="8" md="6" lg="5">
      <v-card class="pa-6" elevation="3">
        <v-card-title class="text-h4 mb-2">Criar Conta</v-card-title>
        <v-card-subtitle class="mb-4"
          >Cadastre-se para começar a usar a plataforma</v-card-subtitle
        >

        <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="name"
            label="Nome completo"
            prepend-inner-icon="mdi-account"
            placeholder="Seu nome"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            prepend-inner-icon="mdi-email"
            placeholder="seu@email.com"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <div class="mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2">Tipo de conta *</div>
            <v-btn-toggle v-model="role" mandatory class="w-100">
              <v-btn value="aluno" class="flex-fill">
                <v-icon start>mdi-school</v-icon>
                Aluno
              </v-btn>
              <v-btn value="instituicao" class="flex-fill">
                <v-icon start>mdi-office-building</v-icon>
                Instituição
              </v-btn>
            </v-btn-toggle>
          </div>

          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            prepend-inner-icon="mdi-lock"
            placeholder="Mínimo 6 caracteres"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            label="Confirmar senha"
            type="password"
            prepend-inner-icon="mdi-lock-check"
            placeholder="Digite a senha novamente"
            required
            class="mb-4"
            variant="outlined"
          ></v-text-field>

          <v-btn
            type="submit"
            :loading="auth.loading"
            color="primary"
            size="large"
            block
            prepend-icon="mdi-account-plus"
          >
            {{ auth.loading ? "Criando conta..." : "Criar conta" }}
          </v-btn>
        </v-form>

        <v-divider class="my-6"></v-divider>

        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis mb-3">Já tem uma conta?</p>
          <v-btn to="/login" variant="outlined" prepend-icon="mdi-login">
            Fazer login
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
