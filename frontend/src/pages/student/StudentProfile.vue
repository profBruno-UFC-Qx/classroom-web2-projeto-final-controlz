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
  <div style="max-width: 720px">
    <header style="margin-bottom: 20px">
      <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 6px">
        Meu Perfil
      </h1>
      <p style="opacity: 0.75; margin: 0">
        Gerencie suas informações pessoais.
      </p>
    </header>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando perfil...</p>
    </div>

    <!-- Erro -->
    <div
      v-else-if="error && !loading"
      style="
        padding: 16px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 10px;
        color: #c33;
        margin-bottom: 16px;
      "
    >
      {{ error }}
    </div>

    <!-- Sucesso -->
    <div
      v-if="success"
      style="
        padding: 16px;
        background: #dcfce7;
        border: 1px solid #86efac;
        border-radius: 10px;
        color: #166534;
        margin-bottom: 16px;
      "
    >
      <strong>✓ Perfil atualizado com sucesso!</strong>
    </div>

    <!-- Formulário -->
    <div
      v-if="!loading"
      style="
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        background: #fff;
      "
    >
      <form @submit.prevent="save" style="display: grid; gap: 16px">
        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Nome *
          </label>
          <input
            v-model="form.name"
            required
            placeholder="Seu nome completo"
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            "
          />
        </div>

        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Email *
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="seu@email.com"
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            "
          />
        </div>

        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Nova senha (deixe em branco para não alterar)
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            "
          />
        </div>

        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Confirmar nova senha
          </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            "
          />
        </div>

        <div
          style="
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            padding-top: 4px;
          "
        >
          <button
            type="submit"
            :disabled="saving"
            :style="{
              padding: '12px 16px',
              border: '1px solid #111827',
              borderRadius: '10px',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '700',
              opacity: saving ? 0.6 : 1,
            }"
          >
            {{ saving ? "Salvando..." : "Salvar alterações" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
