<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useInstitutionStore } from "../../stores/institution.store";
import { useOpportunityStore } from "../../stores/opportunity.store";

const opportunityStore = useOpportunityStore();
const institutionStore = useInstitutionStore();

const opportunities = ref<any[]>([]);

onMounted(async () => {
  try {
    // carregar dados da instituição para obter o id
    const institution = await institutionStore.getMe();

    if (institution) {
      // carregar oportunidades da instituição usando o institutionId
      const result = await opportunityStore.list({
        institutionId: institution.id,
        limit: 100,
      });
      opportunities.value = result.data;
    }
  } catch (err) {
    console.error("Erro ao carregar oportunidades:", err);
  }
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

function statusLabel(isActive: boolean) {
  return isActive ? "Ativa" : "Inativa";
}
</script>

<template>
  <div style="max-width: 1100px">
    <header style="margin-bottom: 20px">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        "
      >
        <div>
          <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 6px">
            Minhas Vagas
          </h1>
          <p style="opacity: 0.75; margin: 0">
            Gerencie suas oportunidades de voluntariado.
          </p>
        </div>
        <RouterLink
          to="/app/institution/vagas/nova"
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
          ➕ Criar nova vaga
        </RouterLink>
      </div>
    </header>

    <!-- loading -->
    <div
      v-if="opportunityStore.loading"
      style="text-align: center; padding: 40px"
    >
      <p style="opacity: 0.75">Carregando vagas...</p>
    </div>

    <!-- erro -->
    <div
      v-else-if="opportunityStore.error"
      style="
        padding: 16px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 10px;
        color: #c33;
        margin-bottom: 20px;
      "
    >
      {{ opportunityStore.error }}
    </div>

    <!-- lista vazia -->
    <div
      v-else-if="opportunities.length === 0"
      style="
        padding: 40px;
        border: 1px dashed #e5e7eb;
        border-radius: 12px;
        text-align: center;
        background: #fff;
      "
    >
      <p style="font-size: 18px; font-weight: 700; margin: 0 0 8px">
        Você ainda não criou nenhuma vaga
      </p>
      <p style="opacity: 0.75; margin: 0 0 16px">
        Crie sua primeira oportunidade de voluntariado.
      </p>
      <RouterLink
        to="/app/institution/vagas/nova"
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
        Criar primeira vaga
      </RouterLink>
    </div>

    <!-- lista de vagas -->
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
              Título
            </th>
            <th
              style="
                text-align: left;
                padding: 12px;
                font-size: 13px;
                opacity: 0.75;
              "
            >
              Categoria
            </th>
            <th
              style="
                text-align: left;
                padding: 12px;
                font-size: 13px;
                opacity: 0.75;
              "
            >
              Cidade
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
              Criada em
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
            v-for="opp in opportunities"
            :key="opp.id"
            style="border-top: 1px solid #e5e7eb"
          >
            <td style="padding: 12px">
              <div style="font-weight: 700">{{ opp.title }}</div>
              <div style="font-size: 13px; opacity: 0.7">
                {{ opp.workloadHours }}h
              </div>
            </td>
            <td style="padding: 12px">
              {{ opp.category || "-" }}
            </td>
            <td style="padding: 12px">
              {{ opp.city || "-" }}
            </td>
            <td style="padding: 12px">
              <span
                :style="{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: opp.isActive ? '#dcfce7' : '#f3f4f6',
                  color: opp.isActive ? '#166534' : '#6b7280',
                  fontSize: '13px',
                }"
              >
                {{ statusLabel(opp.isActive) }}
              </span>
            </td>
            <td style="padding: 12px; font-size: 13px; opacity: 0.7">
              {{ formatDate(opp.createdAt) }}
            </td>
            <td style="padding: 12px">
              <RouterLink
                :to="`/app/institution/vagas/${String(opp.id)}`"
                style="
                  padding: 8px 12px;
                  border: 1px solid #e5e7eb;
                  border-radius: 10px;
                  text-decoration: none;
                  font-size: 13px;
                "
              >
                Gerenciar
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
