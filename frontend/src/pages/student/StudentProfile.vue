<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { http } from "../../services/http";
import { useAuthStore } from "../../stores/auth.store";

const auth = useAuthStore();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const saving = ref(false);
const error = ref("");
const success = ref(false);

async function loadProfile() {
  loading.value = true;
  error.value = "";
  try {
    const response = await http.get<{ user: { id: string; name: string; email: string; role: string } }>("/users/me");
    form.name = response.data.user.name;
    form.email = response.data.user.email;
  } catch (err: any) {
    error.value = err?.response?.data?.message || "Erro ao carregar perfil";
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  error.value = "";
  success.value = false;

  if (!form.name.trim() || !form.email.trim()) {
    error.value = "Preencha todos os campos obrigatórios";
    saving.value = false;
    return;
  }

  if (form.password && form.password !== form.confirmPassword) {
    error.value = "As senhas não coincidem";
    saving.value = false;
    return;
  }

  if (form.password && form.password.length < 6) {
    error.value = "A senha deve ter pelo menos 6 caracteres";
    saving.value = false;
    return;
  }

  try {
    const data: any = {
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (form.password.trim()) {
      data.password = form.password.trim();
    }

    const response = await http.put<{ user: { id: string; name: string; email: string; role: string } }>("/users/me", data);
    
    // Atualiza o store de autenticação
    if (auth.user) {
      auth.user.name = response.data.user.name;
      auth.user.email = response.data.user.email;
      localStorage.setItem("cv_user", JSON.stringify(auth.user));
    }

    success.value = true;
    form.password = "";
    form.confirmPassword = "";

    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (err: any) {
    error.value = err?.response?.data?.message || "Erro ao atualizar perfil";
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 mb-2">Meu Perfil</h1>
        <p class="text-body-1 text-medium-emphasis">
          Gerencie suas informações pessoais e altere sua senha.
        </p>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <!-- Loading -->
      <v-card-text v-if="loading" class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
        <p class="text-medium-emphasis">Carregando perfil...</p>
      </v-card-text>

      <v-card-text v-else>
        <!-- Erro -->
        <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
          {{ error }}
        </v-alert>

        <!-- Sucesso -->
        <v-alert v-if="success" type="success" class="mb-4" closable @click:close="success = false">
          <strong>✓ Perfil atualizado com sucesso!</strong>
        </v-alert>

        <!-- formulário -->
        <v-form @submit.prevent="save">
          <v-text-field
            v-model="form.name"
            label="Nome"
            prepend-inner-icon="mdi-account"
            placeholder="Seu nome completo"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email"
            placeholder="seu@email.com"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-divider class="my-4"></v-divider>

          <div class="text-body-2 text-medium-emphasis mb-3">
            Alterar senha (deixe em branco para não alterar)
          </div>

          <v-text-field
            v-model="form.password"
            label="Nova senha"
            type="password"
            prepend-inner-icon="mdi-lock"
            placeholder="••••••••"
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="form.confirmPassword"
            label="Confirmar nova senha"
            type="password"
            prepend-inner-icon="mdi-lock-check"
            placeholder="••••••••"
            class="mb-4"
            variant="outlined"
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              :loading="saving"
              color="primary"
              size="large"
              prepend-icon="mdi-content-save"
            >
              {{ saving ? "Salvando..." : "Salvar alterações" }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
