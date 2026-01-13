<script setup lang="ts">
// TODO: integrar com API real
// - substituir getApplicationsWithDetailsByStudent() por useApplicationStore().listMyApplications()
// - integrar com GET /applications/me?page=&limit=&status=&opportunityId=
// - implementar paginação
// - loading states
// - atualizar dados após mudanças
import { computed, ref } from "vue";
import { getApplicationsWithDetailsByStudent } from "../../data/mock";
import { useAuthStore } from "../../stores/auth.store";

const auth = useAuthStore();

// ✅ força string (corrige o erro ts-plugin)
const studentId = computed(() => String(auth.user?.id ?? "stu1"));

const statusFilter = ref<
  "todos" | "pendente" | "aceita" | "recusada" | "concluida"
>("todos");

const items = computed(() =>
  getApplicationsWithDetailsByStudent(studentId.value)
);

const filtered = computed(() => {
  if (statusFilter.value === "todos") return items.value;
  return items.value.filter((i) => i.status === statusFilter.value);
});

function statusLabel(s: string) {
  if (s === "pendente") return "Pendente";
  if (s === "aceita") return "Aceita";
  if (s === "recusada") return "Recusada";
  if (s === "concluida") return "Concluída";
  return s;
}
</script>

<template>
  <div style="max-width: 980px">
    <header style="margin-bottom: 16px">
      <h1 style="font-size: 28px; font-weight: 800">Minhas Candidaturas</h1>
      <p style="opacity: 0.75">Acompanhe o status das suas candidaturas.</p>
    </header>

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
        <option value="pendente">Pendente</option>
        <option value="aceita">Aceita</option>
        <option value="recusada">Recusada</option>
        <option value="concluida">Concluída</option>
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
        to="/oportunidades"
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
              <div style="font-weight: 700">{{ row.opportunity.title }}</div>
              <div style="font-size: 13px; opacity: 0.7">
                {{ row.opportunity.city }} • {{ row.createdAt }}
              </div>
            </td>

            <td style="padding: 12px">{{ row.opportunity.institutionName }}</td>

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

            <td style="padding: 12px">{{ row.opportunity.workloadHours }}h</td>

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
  </div>
</template>
