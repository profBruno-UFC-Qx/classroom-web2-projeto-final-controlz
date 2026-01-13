<script setup lang="ts">
import { computed } from "vue";
import { applications, opportunities } from "../../data/mock";
import { useAuthStore } from "../../stores/auth.store";

const auth = useAuthStore();

// (mock) se seu auth não tem institutionId real, usa um fixo por enquanto:
const institutionId = computed(
  () => (auth.user as any)?.institutionId ?? "inst1"
);

// Lista só as vagas da instituição logada
const myOpportunities = computed(() =>
  opportunities.filter((o) => o.institutionId === institutionId.value)
);

// Conta candidatos por vaga
function candidatesCount(opportunityId: string) {
  return applications.filter((a) => a.opportunityId === opportunityId).length;
}
</script>

<template>
  <div style="max-width: 980px">
    <header
      style="
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
      "
    >
      <div>
        <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 6px">
          Minhas Vagas
        </h1>
        <p style="opacity: 0.75; margin: 0">
          Gerencie suas oportunidades e acompanhe candidatos.
        </p>
      </div>

      <RouterLink
        to="/app/institution/vagas/nova"
        style="
          display: inline-block;
          padding: 10px 12px;
          border: 1px solid #111827;
          border-radius: 10px;
          text-decoration: none;
          background: #111827;
          color: #fff;
        "
      >
        + Criar nova vaga
      </RouterLink>
    </header>

    <div
      v-if="myOpportunities.length === 0"
      style="
        padding: 18px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
      "
    >
      <strong>Você ainda não publicou nenhuma vaga.</strong>
      <p style="opacity: 0.75; margin-top: 6px">
        Clique em “Criar nova vaga” para começar.
      </p>
      <RouterLink
        to="/app/institution/vagas/nova"
        style="
          display: inline-block;
          margin-top: 10px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          text-decoration: none;
        "
      >
        Criar nova vaga
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
              Candidatos
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
            v-for="opp in myOpportunities"
            :key="opp.id"
            style="border-top: 1px solid #e5e7eb"
          >
            <td style="padding: 12px">
              <div style="font-weight: 800">{{ opp.title }}</div>
              <div style="font-size: 13px; opacity: 0.7">
                {{ opp.city }} • {{ opp.institutionName }}
              </div>
            </td>

            <td style="padding: 12px">{{ opp.category }}</td>

            <td style="padding: 12px">{{ opp.workloadHours }}h</td>

            <td style="padding: 12px">
              <span
                style="
                  padding: 4px 10px;
                  border-radius: 999px;
                  background: #f3f4f6;
                  font-size: 13px;
                "
              >
                {{ candidatesCount(opp.id) }}
              </span>
            </td>

            <td style="padding: 12px">
              <RouterLink
                :to="`/app/institution/vagas/${String(opp.id)}`"
                style="
                  padding: 8px 10px;
                  border: 1px solid #e5e7eb;
                  border-radius: 10px;
                  text-decoration: none;
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