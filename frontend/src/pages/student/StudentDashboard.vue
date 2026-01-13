<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApplicationStore } from "../../stores/application.store";

const applicationStore = useApplicationStore();

const stats = ref({
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  completed: 0,
});

const loading = ref(true);
const error = ref("");

// Carrega todas as candidaturas para calcular estatísticas
async function loadStats() {
  loading.value = true;
  error.value = "";
  try {
    const result = await applicationStore.listMyApplications({ limit: 100 });
    const apps = result.data;

    stats.value = {
      total: apps.length,
      pending: apps.filter((a) => a.status === "pending").length,
      accepted: apps.filter((a) => a.status === "accepted").length,
      rejected: apps.filter((a) => a.status === "rejected").length,
      completed: apps.filter((a) => a.status === "completed").length,
    };
  } catch (err: any) {
    error.value = applicationStore.error || "Erro ao carregar estatísticas";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadStats();
});
</script>

<template>
  <div style="max-width: 1100px">
    <header style="margin-bottom: 20px">
      <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 6px">
        Dashboard do Aluno
      </h1>
      <p style="opacity: 0.75; margin: 0">
        Acompanhe suas candidaturas e estatísticas.
      </p>
    </header>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando estatísticas...</p>
    </div>

    <!-- Erro -->
    <div
      v-else-if="error"
      style="
        padding: 16px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 10px;
        color: #c33;
        margin-bottom: 20px;
      "
    >
      {{ error }}
    </div>

    <!-- Estatísticas -->
    <div
      v-else
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      "
    >
      <div
        style="
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        "
      >
        <div style="font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          Total de candidaturas
        </div>
        <div style="font-size: 32px; font-weight: 800; color: #111827">
          {{ stats.total }}
        </div>
      </div>

      <div
        style="
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        "
      >
        <div style="font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          Pendentes
        </div>
        <div style="font-size: 32px; font-weight: 800; color: #f59e0b">
          {{ stats.pending }}
        </div>
      </div>

      <div
        style="
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        "
      >
        <div style="font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          Aceitas
        </div>
        <div style="font-size: 32px; font-weight: 800; color: #10b981">
          {{ stats.accepted }}
        </div>
      </div>

      <div
        style="
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        "
      >
        <div style="font-size: 13px; opacity: 0.75; margin-bottom: 6px">
          Concluídas
        </div>
        <div style="font-size: 32px; font-weight: 800; color: #3b82f6">
          {{ stats.completed }}
        </div>
      </div>
    </div>

    <!-- Links rápidos -->
    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px">
      <RouterLink
        to="/app/student/candidaturas"
        style="
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          font-weight: 700;
          background: #fff;
          color: #111827;
        "
      >
        📋 Ver todas as candidaturas
      </RouterLink>

      <RouterLink
        to="/app/student/oportunidades"
        style="
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #111827;
          text-decoration: none;
          font-weight: 700;
          background: #111827;
          color: #fff;
        "
      >
        🔍 Explorar oportunidades
      </RouterLink>

      <RouterLink
        to="/app/student/perfil"
        style="
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          font-weight: 700;
          background: #fff;
          color: #111827;
        "
      >
        👤 Meu perfil
      </RouterLink>
    </div>

    <!-- Resumo rápido -->
    <div
      v-if="stats.total === 0"
      style="
        padding: 40px;
        border: 1px dashed #e5e7eb;
        border-radius: 12px;
        text-align: center;
        background: #fff;
      "
    >
      <p style="font-size: 18px; font-weight: 700; margin: 0 0 8px">
        Você ainda não se candidatou a nenhuma oportunidade
      </p>
      <p style="opacity: 0.75; margin: 0 0 16px">
        Explore as oportunidades disponíveis e encontre uma causa para participar.
      </p>
      <RouterLink
        to="/app/student/oportunidades"
        style="
          display: inline-block;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #111827;
          text-decoration: none;
          font-weight: 700;
          background: #111827;
          color: #fff;
        "
      >
        Explorar oportunidades
      </RouterLink>
    </div>
  </div>
</template>
