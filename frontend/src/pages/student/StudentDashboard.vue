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
  <div>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 mb-2">Dashboard do Aluno</h1>
        <p class="text-body-1 text-medium-emphasis">
          Acompanhe suas candidaturas e estatísticas.
        </p>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-card v-if="loading" class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
      <p class="text-medium-emphasis">Carregando estatísticas...</p>
    </v-card>

    <!-- Erro -->
    <v-alert v-else-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Estatísticas -->
    <v-row v-else class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-2">
              Total de candidaturas
            </div>
            <div class="text-h4 font-weight-bold">{{ stats.total }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" color="warning" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-2">
              Pendentes
            </div>
            <div class="text-h4 font-weight-bold">{{ stats.pending }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" color="success" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-2">Aceitas</div>
            <div class="text-h4 font-weight-bold">{{ stats.accepted }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" color="info" variant="tonal">
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-2">Concluídas</div>
            <div class="text-h4 font-weight-bold">{{ stats.completed }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Links rápidos -->
    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-btn
          to="/app/student/candidaturas"
          block
          variant="outlined"
          size="large"
          prepend-icon="mdi-file-document"
        >
          Ver todas as candidaturas
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn
          to="/app/student/oportunidades"
          block
          variant="outlined"
          size="large"
          prepend-icon="mdi-briefcase"
        >
          Explorar oportunidades
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn
          to="/app/student/perfil"
          block
          variant="outlined"
          size="large"
          prepend-icon="mdi-account"
        >
          Meu perfil
        </v-btn>
      </v-col>
    </v-row>

    <!-- resumo rápido -->
    <v-card v-if="stats.total === 0" class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-information-outline</v-icon>
      <h3 class="text-h6 mb-2">
        Você ainda não se candidatou a nenhuma oportunidade
      </h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        Explore as oportunidades disponíveis e encontre uma causa para participar.
      </p>
      <v-btn
        to="/app/student/oportunidades"
        color="primary"
        prepend-icon="mdi-briefcase"
      >
        Explorar oportunidades
      </v-btn>
    </v-card>
  </div>
</template>
