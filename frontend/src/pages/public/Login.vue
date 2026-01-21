<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";

// Store de autenticacao e roteador
const auth = useAuthStore();
const router = useRouter();

// Estado do formulario
const email = ref("");
const password = ref("");
const error = ref("");

// Retorna rota do dashboard baseado no papel do usuario
function getDashboardRoute(role: string) {
  if (role === "aluno") return "/app/student/dashboard";
  if (role === "instituicao") return "/app/institution/dashboard";
  if (role === "admin") return "/app/admin/dashboard";
  return "/";
}

// Processa login e redireciona para dashboard apropriado
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
  <!-- Pagina publica de login do sistema -->
  <v-row justify="center">
    <v-col cols="12" sm="8" md="6" lg="4">
      <v-card class="pa-6" elevation="3">
        <v-card-title class="text-h4 mb-2">Entrar</v-card-title>
        <v-card-subtitle class="mb-4"
          >Faça login para acessar sua conta</v-card-subtitle
        >

        <!-- Exibe mensagens de erro -->
        <v-alert
          v-if="error"
          type="error"
          class="mb-4"
          closable
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <!-- Formulario de login com email e senha -->
        <v-form @submit.prevent="handleSubmit">
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

          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            prepend-inner-icon="mdi-lock"
            placeholder="••••••••"
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
            prepend-icon="mdi-login"
          >
            {{ auth.loading ? "Entrando..." : "Entrar" }}
          </v-btn>
        </v-form>

        <v-divider class="my-6"></v-divider>

        <!-- Link para criacao de nova conta -->
        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis mb-3">
            Não tem uma conta?
          </p>
          <v-btn
            to="/cadastro"
            variant="outlined"
            prepend-icon="mdi-account-plus"
          >
            Criar conta
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
