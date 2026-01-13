<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getApplicationsWithDetailsByOpportunity,
  getOpportunityById,
  type ApplicationStatus,
} from "../../data/mock";
import { useAuthStore } from "../../stores/auth.store";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const opportunityId = String(route.params.id);

// (mock) instituição logada
const institutionId = computed(
  () => (auth.user as any)?.institutionId ?? "inst1"
);

const opportunity = computed(() => getOpportunityById(opportunityId));

const canAccess = computed(() => {
  if (!opportunity.value) return false;
  return opportunity.value.institutionId === institutionId.value;
});

// Lista candidatos (mock)
const list = computed(() =>
  getApplicationsWithDetailsByOpportunity(opportunityId)
);

// Como estamos em mock, vamos manter um estado local para “alterar status”
const localStatus = ref<Record<string, ApplicationStatus>>({});

function currentStatus(appId: string, original: ApplicationStatus) {
  return localStatus.value[appId] ?? original;
}

function setStatus(appId: string, status: ApplicationStatus) {
  localStatus.value = { ...localStatus.value, [appId]: status };
}

function statusLabel(s: ApplicationStatus) {
  if (s === "pendente") return "Pendente";
  if (s === "aceita") return "Aceita";
  if (s === "recusada") return "Recusada";
  if (s === "concluida") return "Concluída";
  return s;
}

function back() {
  router.push({ name: "institution_opportunities" });
}
</script>

<template>
  <div style="max-width: 980px">
    <button
      @click="back"
      style="
        padding: 8px 10px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        background: #fff;
        cursor: pointer;
        margin-bottom: 14px;
      "
    >
      ← Voltar para minhas vagas
    </button>

    <div
      v-if="!opportunity"
      style="
        padding: 18px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
      "
    >
      <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 6px">
        Vaga não encontrada
      </h1>
      <p style="opacity: 0.75; margin: 0">Verifique o link.</p>
    </div>

    <div
      v-else-if="!canAccess"
      style="
        padding: 18px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
      "
    >
      <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 6px">
        Acesso negado
      </h1>
      <p style="opacity: 0.75; margin: 0">
        Você não pode gerenciar uma vaga de outra instituição.
      </p>
    </div>

    <div v-else>
      <header style="margin-bottom: 14px">
        <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 6px">
          Gerenciar Vaga
        </h1>
        <p style="opacity: 0.75; margin: 0">
          Acompanhe e atualize o status das candidaturas.
        </p>
      </header>

      <!-- Resumo da vaga -->
      <div
        style="
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          background: #fff;
          margin-bottom: 14px;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          "
        >
          <div>
            <div style="font-size: 18px; font-weight: 900">
              {{ opportunity.title }}
            </div>
            <div style="opacity: 0.75; margin-top: 4px">
              {{ opportunity.city }} • {{ opportunity.category }}
            </div>
          </div>

          <div style="text-align: right">
            <div style="opacity: 0.75; font-size: 13px">Carga horária</div>
            <div style="font-weight: 900; margin-top: 4px">
              {{ opportunity.workloadHours }}h
            </div>
          </div>
        </div>

        <p style="margin-top: 12px; opacity: 0.85; line-height: 1.5">
          {{ opportunity.description }}
        </p>
      </div>

      <!-- Lista de candidatos -->
      <div
        style="
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        "
      >
        <div style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb">
          <h2 style="margin: 0; font-size: 18px; font-weight: 900">
            Candidatos
          </h2>
          <p style="margin: 6px 0 0; opacity: 0.75; font-size: 13px">
            Total: {{ list.length }}
          </p>
        </div>

        <div v-if="list.length === 0" style="padding: 16px; opacity: 0.8">
          Nenhuma candidatura nesta vaga ainda.
        </div>

        <table v-else style="width: 100%; border-collapse: collapse">
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
                Aluno
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
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="row in list"
              :key="row.id"
              style="border-top: 1px solid #e5e7eb"
            >
              <td style="padding: 12px">
                <div style="font-weight: 900">{{ row.student.name }}</div>
                <div style="font-size: 13px; opacity: 0.7">
                  Candidatura: {{ row.createdAt }}
                </div>
              </td>

              <td style="padding: 12px">
                <span
                  style="
                    padding: 4px 10px;
                    border-radius: 999px;
                    background: #f3f4f6;
                    font-size: 13px;
                    font-weight: 700;
                  "
                >
                  {{ statusLabel(currentStatus(row.id, row.status)) }}
                </span>
              </td>

              <td style="padding: 12px">
                <div style="display: flex; gap: 10px; flex-wrap: wrap">
                  <button
                    @click="setStatus(row.id, 'aceita')"
                    style="
                      padding: 8px 10px;
                      border: 1px solid #111827;
                      border-radius: 10px;
                      background: #111827;
                      color: #fff;
                      cursor: pointer;
                    "
                  >
                    Aceitar
                  </button>

                  <button
                    @click="setStatus(row.id, 'recusada')"
                    style="
                      padding: 8px 10px;
                      border: 1px solid #e5e7eb;
                      border-radius: 10px;
                      background: #fff;
                      cursor: pointer;
                    "
                  >
                    Recusar
                  </button>

                  <button
                    @click="setStatus(row.id, 'pendente')"
                    style="
                      padding: 8px 10px;
                      border: 1px solid #e5e7eb;
                      border-radius: 10px;
                      background: #fff;
                      cursor: pointer;
                      opacity: 0.9;
                    "
                  >
                    Voltar p/ pendente
                  </button>
                </div>

                <div style="margin-top: 8px; font-size: 12px; opacity: 0.7">
                  (mock) altera apenas na tela.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
