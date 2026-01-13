<script setup lang="ts">
import { computed } from "vue";
import {
  getApplicationsByInstitution,
  getOpportunitiesByInstitution,
} from "../../data/mock";
import { useAuthStore } from "../../stores/auth.store";

const auth = useAuthStore();

// mock: se não tiver institutionId real no auth, usa inst1
const institutionId = computed(
  () => (auth.user as any)?.institutionId ?? "inst1"
);

const opportunities = computed(() =>
  getOpportunitiesByInstitution(institutionId.value)
);

const applications = computed(() =>
  getApplicationsByInstitution(institutionId.value)
);

const pendingApplications = computed(() =>
  applications.value.filter((a) => a.status === "pendente")
);
</script>

<template>
  <div style="max-width: 1100px">
    <header style="margin-bottom: 20px">
      <h1 style="font-size: 28px; font-weight: 800">
        Dashboard da Instituição
      </h1>
      <p style="opacity: 0.75">Acompanhe suas vagas e candidaturas.</p>
    </header>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 22px;
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
        <strong>Vagas ativas</strong>
        <div style="font-size: 28px; font-weight: 800; margin-top: 6px">
          {{ opportunities.length }}
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
        <strong>Total de candidaturas</strong>
        <div style="font-size: 28px; font-weight: 800; margin-top: 6px">
          {{ applications.length }}
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
        <strong>Pendentes</strong>
        <div style="font-size: 28px; font-weight: 800; margin-top: 6px">
          {{ pendingApplications.length }}
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap">
      <RouterLink
        to="/app/institution/vagas/nova"
        style="
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          font-weight: 700;
        "
      >
        ➕ Criar nova vaga
      </RouterLink>

      <RouterLink
        to="/app/institution/vagas"
        style="
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          font-weight: 700;
        "
      >
        📋 Minhas vagas
      </RouterLink>
    </div>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px">
        Últimas vagas
      </h2>

      <div v-if="opportunities.length === 0" style="opacity: 0.75">
        Nenhuma vaga criada ainda.
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
          v-for="opp in opportunities.slice(0, 5)"
          :key="opp.id"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px;
            border-top: 1px solid #e5e7eb;
          "
        >
          <div>
            <strong>{{ opp.title }}</strong>
            <div style="font-size: 13px; opacity: 0.7">
              {{ opp.category }} • {{ opp.workloadHours }}h
            </div>
          </div>

          <RouterLink
            :to="`/app/institution/vagas/${String(opp.id)}`"
            style="
              padding: 8px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              text-decoration: none;
            "
          >
            Gerenciar
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
