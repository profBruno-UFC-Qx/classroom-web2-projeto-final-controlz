<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useApplicationStore, type Application } from "../../stores/application.store";
import { useOpportunityStore } from "../../stores/opportunity.store";

const applicationStore = useApplicationStore();
const opportunityStore = useOpportunityStore();

const statusFilter = ref<
  "todos" | "pending" | "accepted" | "rejected" | "completed"
>("todos");

// Mapear status do backend para exibição
const statusMap: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceita",
  rejected: "Recusada",
  completed: "Concluída",
};

// Aplicações com dados da oportunidade carregados
const applicationsWithDetails = ref<
  Array<
    Application & {
      opportunityData?: {
        title: string;
        city?: string | null;
        category?: string | null;
        workloadHours: number;
        institutionName?: string;
      };
    }
  >
>([]);

async function loadApplications() {
  try {
    const query: any = { limit: 50 };
    if (statusFilter.value !== "todos") {
      query.status = statusFilter.value;
    }

    const result = await applicationStore.listMyApplications(query);

    // Buscar dados das oportunidades
    const applicationsWithOpps = await Promise.all(
      result.data.map(async (app) => {
        try {
          const opp = await opportunityStore.getById(app.opportunityId);
          return {
            ...app,
            opportunityData: opp
              ? {
                  title: opp.title,
                  city: opp.city,
                  category: opp.category,
                  workloadHours: opp.workloadHours,
                  institutionName: "Instituição", // TODO: buscar nome da instituição se necessário
                }
              : undefined,
          };
        } catch (err) {
          return {
            ...app,
            opportunityData: undefined,
          };
        }
      })
    );

    applicationsWithDetails.value = applicationsWithOpps;
  } catch (err) {
    console.error("Erro ao carregar candidaturas:", err);
  }
}

const filtered = computed(() => {
  if (statusFilter.value === "todos") return applicationsWithDetails.value;
  return applicationsWithDetails.value.filter(
    (a) => a.status === statusFilter.value
  );
});

function statusLabel(status: string) {
  return statusMap[status] || status;
}

onMounted(() => {
  loadApplications();
});

// Recarrega quando o filtro muda
const filterWatcher = computed(() => statusFilter.value);
watch(filterWatcher, () => {
  loadApplications();
});
</script>

<template>
  <div style="max-width: 980px">
    <header style="margin-bottom: 16px">
      <h1 style="font-size: 28px; font-weight: 800">Minhas Candidaturas</h1>
      <p style="opacity: 0.75">Acompanhe o status das suas candidaturas.</p>
    </header>

    <!-- Loading -->
    <div v-if="applicationStore.loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando candidaturas...</p>
    </div>

    <!-- Erro -->
    <div
      v-else-if="applicationStore.error"
      style="
        padding: 16px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 10px;
        color: #c33;
        margin-bottom: 16px;
      "
    >
      {{ applicationStore.error }}
    </div>

    <!-- Conteúdo -->
    <template v-else>
      <div
        style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px"
      >
      <label style="font-size: 14px; opacity: 0.8">Filtrar por status:</label>
      <select
        v-model="statusFilter"
        style="
          padding: 8px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        "
      >
        <option value="todos">Todos</option>
        <option value="pending">Pendente</option>
        <option value="accepted">Aceita</option>
        <option value="rejected">Recusada</option>
        <option value="completed">Concluída</option>
      </select>
    </div>

    <div
      v-if="filtered.length === 0"
      style="
        padding: 18px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
      "
    >
      <strong>Nenhuma candidatura encontrada.</strong>
      <p style="opacity: 0.75; margin-top: 6px">
        Tente mudar o filtro ou explore novas oportunidades.
      </p>
      <RouterLink
        to="/app/student/oportunidades"
        style="
          display: inline-block;
          margin-top: 10px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          text-decoration: none;
        "
      >
        Explorar oportunidades
      </RouterLink>
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
      <table style="width: 100%; border-collapse: collapse">
        <thead style="background: #f9fafb">
          <tr>
            <th
              style="
                text-align: left;
                padding: 12px;
                font-size: 13px;
                opacity: 0.75;
              "
            >
              Vaga
            </th>
            <th
              style="
                text-align: left;
                padding: 12px;
                font-size: 13px;
                opacity: 0.75;
              "
            >
              Instituição
            </th>
            <th
              style="
                text-align: left;
                padding: 12px;
                font-size: 13px;
                opacity: 0.75;
              "
            >
              Status
            </th>
            <th
              style="
                text-align: left;
                padding: 12px;
                font-size: 13px;
                opacity: 0.75;
              "
            >
              Carga
            </th>
            <th
              style="
                text-align: left;
                padding: 12px;
                font-size: 13px;
                opacity: 0.75;
              "
            >
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in filtered"
            :key="row.id"
            style="border-top: 1px solid #e5e7eb"
          >
            <td style="padding: 12px">
              <div v-if="row.opportunityData" style="font-weight: 700">
                {{ row.opportunityData.title }}
              </div>
              <div v-else style="font-weight: 700; opacity: 0.5">
                Carregando...
              </div>
              <div v-if="row.opportunityData" style="font-size: 13px; opacity: 0.7">
                {{ row.opportunityData.city || "Cidade não informada" }} •
                {{ new Date(row.createdAt).toLocaleDateString("pt-BR") }}
              </div>
            </td>

            <td style="padding: 12px">
              {{ row.opportunityData?.institutionName || "-" }}
            </td>

            <td style="padding: 12px">
              <span
                style="
                  padding: 4px 10px;
                  border-radius: 999px;
                  background: #f3f4f6;
                  font-size: 13px;
                "
              >
                {{ statusLabel(row.status) }}
              </span>
            </td>

            <td style="padding: 12px">
              {{ row.opportunityData?.workloadHours || "-" }}h
            </td>

            <td style="padding: 12px">
              <RouterLink
                :to="`/app/student/candidaturas/${String(row.id)}`"
                style="
                  padding: 8px 10px;
                  border: 1px solid #e5e7eb;
                  border-radius: 10px;
                  text-decoration: none;
                "
              >
                Detalhes
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </template>
  </div>
</template>
