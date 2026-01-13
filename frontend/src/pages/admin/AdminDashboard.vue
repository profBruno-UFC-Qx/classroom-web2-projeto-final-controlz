<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useInstitutionStore } from "../../stores/institution.store";
import { useApplicationStore } from "../../stores/application.store";
import { useOpportunityStore } from "../../stores/opportunity.store";
import { http } from "../../services/http";

const institutionStore = useInstitutionStore();
const applicationStore = useApplicationStore();
const opportunityStore = useOpportunityStore();

const loading = ref(true);
const error = ref("");

const stats = ref({
  pendingInstitutions: 0,
  approvedInstitutions: 0,
  totalApplications: 0,
  totalOpportunities: 0,
});

const pendingInstitutions = ref<any[]>([]);
const processingId = ref<string | null>(null);

async function loadData() {
  loading.value = true;
  error.value = "";
  try {
    // Carregar instituições pendentes
    const instResult = await institutionStore.list({ status: "pending", limit: 50 });
    pendingInstitutions.value = instResult.data;
    stats.value.pendingInstitutions = instResult.data.length;

    // Carregar todas as instituições para contar aprovadas
    const allInstResult = await institutionStore.list({ status: "approved", limit: 100 });
    stats.value.approvedInstitutions = allInstResult.data.length;

    // Carregar candidaturas (admin pode listar todas via GET /applications)
    try {
      const appResponse = await http.get("/applications", { params: { limit: 1 } });
      stats.value.totalApplications = appResponse.data.meta?.total || 0;
    } catch (err) {
      // Se falhar, tenta com listInstitutionApplications como fallback
      const appResult = await applicationStore.listInstitutionApplications({ limit: 1 });
      stats.value.totalApplications = appResult.meta?.total || 0;
    }

    // Carregar oportunidades
    const oppResult = await opportunityStore.list({ limit: 1 });
    stats.value.totalOpportunities = oppResult.meta?.total || 0;
  } catch (err: any) {
    error.value = institutionStore.error || applicationStore.error || opportunityStore.error || "Erro ao carregar dados";
  } finally {
    loading.value = false;
  }
}

async function approveInstitution(id: string) {
  if (!confirm("Deseja aprovar esta instituição?")) return;

  processingId.value = id;
  try {
    await institutionStore.approve(id);
    // Remove da lista de pendentes
    pendingInstitutions.value = pendingInstitutions.value.filter((i) => i.id !== id);
    stats.value.pendingInstitutions--;
    stats.value.approvedInstitutions++;
  } catch (err: any) {
    alert(institutionStore.error || "Erro ao aprovar instituição");
  } finally {
    processingId.value = null;
  }
}

async function rejectInstitution(id: string) {
  if (!confirm("Deseja rejeitar esta instituição? Esta ação não pode ser desfeita.")) return;

  processingId.value = id;
  try {
    await institutionStore.reject(id);
    // Remove da lista de pendentes
    pendingInstitutions.value = pendingInstitutions.value.filter((i) => i.id !== id);
    stats.value.pendingInstitutions--;
  } catch (err: any) {
    alert(institutionStore.error || "Erro ao rejeitar instituição");
  } finally {
    processingId.value = null;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div style="max-width: 1200px">
    <header style="margin-bottom: 20px">
      <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 6px">
        Dashboard do Administrador
      </h1>
      <p style="opacity: 0.75; margin: 0">
        Gerencie instituições, usuários e candidaturas do sistema.
      </p>
    </header>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando dados...</p>
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

    <!-- Conteúdo -->
    <template v-else>
      <!-- Estatísticas -->
      <div
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
            Instituições pendentes
          </div>
          <div style="font-size: 32px; font-weight: 800; color: #f59e0b">
            {{ stats.pendingInstitutions }}
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
            Instituições aprovadas
          </div>
          <div style="font-size: 32px; font-weight: 800; color: #10b981">
            {{ stats.approvedInstitutions }}
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
            Total de candidaturas
          </div>
          <div style="font-size: 32px; font-weight: 800; color: #111827">
            {{ stats.totalApplications }}
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
            Total de oportunidades
          </div>
          <div style="font-size: 32px; font-weight: 800; color: #111827">
            {{ stats.totalOpportunities }}
          </div>
        </div>
      </div>

      <!-- Instituições pendentes -->
      <section style="margin-bottom: 24px">
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px">
          Instituições Pendentes de Aprovação
        </h2>

        <div v-if="pendingInstitutions.length === 0" style="opacity: 0.75; padding: 20px; text-align: center">
          Nenhuma instituição pendente no momento.
        </div>

        <div
          v-else
          style="
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
          "
        >
          <div
            v-for="inst in pendingInstitutions"
            :key="inst.id"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px;
              border-top: 1px solid #e5e7eb;
            "
          >
            <div style="flex: 1">
              <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px">
                {{ inst.name }}
              </div>
              <div style="font-size: 13px; opacity: 0.7; margin-bottom: 4px">
                {{ inst.city || "Cidade não informada" }}
                <span v-if="inst.address"> • {{ inst.address }}</span>
              </div>
              <div v-if="inst.description" style="font-size: 13px; opacity: 0.7; margin-top: 4px">
                {{ inst.description.length > 100 ? inst.description.substring(0, 100) + "..." : inst.description }}
              </div>
              <div style="font-size: 12px; opacity: 0.6; margin-top: 4px">
                Cadastrada em: {{ formatDate(inst.createdAt) }}
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-left: 16px">
              <button
                @click="approveInstitution(inst.id)"
                :disabled="processingId === inst.id"
                :style="{
                  padding: '10px 16px',
                  border: '1px solid #10b981',
                  borderRadius: '10px',
                  background: '#10b981',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  opacity: processingId === inst.id ? 0.6 : 1,
                }"
              >
                {{ processingId === inst.id ? "Processando..." : "✓ Aprovar" }}
              </button>
              <button
                @click="rejectInstitution(inst.id)"
                :disabled="processingId === inst.id"
                :style="{
                  padding: '10px 16px',
                  border: '1px solid #ef4444',
                  borderRadius: '10px',
                  background: '#ef4444',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  opacity: processingId === inst.id ? 0.6 : 1,
                }"
              >
                {{ processingId === inst.id ? "Processando..." : "✕ Rejeitar" }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
