<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApplicationStore, type Application } from "../../stores/application.store";
import { useOpportunityStore } from "../../stores/opportunity.store";
import { useAuthStore } from "../../stores/auth.store";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const applicationStore = useApplicationStore();
const opportunityStore = useOpportunityStore();

const applicationId = String(route.params.id);
const application = ref<Application | null>(null);
const opportunity = ref<any>(null);
const loading = ref(true);
const error = ref("");

const canAccess = computed(() => {
  if (!application.value || !auth.user) return false;
  return application.value.studentId === auth.user.id;
});

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    pending: "Pendente",
    accepted: "Aceita",
    rejected: "Recusada",
    completed: "Concluída",
  };
  return map[s] || s;
};

const statusHint = computed(() => {
  const s = application.value?.status;
  if (!s) return "";

  if (s === "pending") {
    return "Sua candidatura foi enviada. Aguarde a análise da instituição.";
  }
  if (s === "accepted") {
    return "Parabéns! Você foi aceito. Agora siga o fluxo do termo de compromisso.";
  }
  if (s === "rejected") {
    return "Sua candidatura foi recusada. Você pode se candidatar a outras oportunidades.";
  }
  if (s === "completed") {
    return "Atividade concluída! Seu certificado está disponível para download.";
  }
  return "";
});

// Timeline simples (3 etapas)
const steps = computed(() => {
  const s = application.value?.status;

  const sentDone = !!application.value;
  const approvedDone = s === "accepted" || s === "completed";
  const rejectedDone = s === "rejected";
  const completedDone = s === "completed";

  return {
    sentDone,
    approvedDone,
    rejectedDone,
    completedDone,
  };
});

// Carregar dados
onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    // Buscar todas as candidaturas e encontrar a específica
    const result = await applicationStore.listMyApplications({ limit: 100 });
    const found = result.data.find((a) => a.id === applicationId);

    if (!found) {
      error.value = "Candidatura não encontrada";
      loading.value = false;
      return;
    }

    // Verificar se pertence ao aluno
    if (found.studentId !== auth.user?.id) {
      error.value = "Acesso negado";
      loading.value = false;
      return;
    }

    application.value = found;

    // Buscar dados da oportunidade
    try {
      await opportunityStore.getById(found.opportunityId);
      opportunity.value = opportunityStore.currentOpportunity;
    } catch (err) {
      console.error("Erro ao carregar oportunidade:", err);
    }
  } catch (err: any) {
    error.value = applicationStore.error || "Erro ao carregar candidatura";
  } finally {
    loading.value = false;
  }
});

// Ações mock (podem ficar mock por enquanto)
function downloadTerm() {
  alert("Download do termo (mock).");
}

function uploadSignedTerm() {
  alert("Upload do termo assinado (mock).");
}

function downloadCertificate() {
  alert("Download do certificado (mock).");
}

function goBack() {
  router.push({ name: "student_applications" });
}
</script>

<template>
  <div style="max-width: 980px">
    <button
      @click="goBack"
      style="
        padding: 8px 10px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        background: #fff;
        cursor: pointer;
        margin-bottom: 14px;
      "
    >
      ← Voltar para minhas candidaturas
    </button>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando candidatura...</p>
    </div>

    <!-- Erros / segurança -->
    <div
      v-else-if="error || !application"
      style="
        padding: 18px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
      "
    >
      <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 6px">
        {{ error || "Candidatura não encontrada" }}
      </h1>
      <p style="opacity: 0.75; margin: 0">Verifique se o link está correto.</p>
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
      <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 6px">
        Acesso negado
      </h1>
      <p style="opacity: 0.75; margin: 0">
        Você não tem permissão para visualizar esta candidatura.
      </p>
    </div>

    <div v-else>
      <!-- Header -->
      <header style="margin-bottom: 14px">
        <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 6px">
          Detalhe da Candidatura
        </h1>
        <p style="opacity: 0.75; margin: 0">
          Veja o status e os próximos passos do seu processo.
        </p>
      </header>

      <!-- Resumo -->
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
            <div v-if="opportunity" style="font-size: 18px; font-weight: 800">
              {{ opportunity.title }}
            </div>
            <div v-else style="font-size: 18px; font-weight: 800; opacity: 0.5">
              Carregando...
            </div>
            <div v-if="opportunity" style="opacity: 0.75; margin-top: 4px">
              {{ opportunity.city || "Cidade não informada" }}
              <span v-if="opportunity.category"> • {{ opportunity.category }}</span>
            </div>
            <div v-if="application" style="opacity: 0.75; margin-top: 4px; font-size: 13px">
              Candidatura em: {{ new Date(application.createdAt).toLocaleDateString("pt-BR") }}
            </div>
          </div>

          <div style="text-align: right">
            <div style="opacity: 0.75; font-size: 13px">Status</div>
            <div
              style="
                display: inline-block;
                margin-top: 6px;
                padding: 4px 10px;
                border-radius: 999px;
                background: #f3f4f6;
                font-size: 13px;
                font-weight: 700;
              "
            >
              {{ application ? statusLabel(application.status) : "-" }}
            </div>
            <div v-if="opportunity" style="margin-top: 8px; opacity: 0.75; font-size: 13px">
              {{ opportunity.workloadHours }}h
              <span v-if="opportunity.category"> • {{ opportunity.category }}</span>
            </div>
          </div>
        </div>

        <div
          style="
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
          "
        >
          <strong>Mensagem:</strong>
          <div style="opacity: 0.8; margin-top: 4px">
            {{ statusHint }}
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div
        style="
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          background: #fff;
          margin-bottom: 14px;
        "
      >
        <h2 style="margin: 0 0 10px; font-size: 18px; font-weight: 800">
          Progresso
        </h2>

        <div style="display: flex; gap: 10px; flex-wrap: wrap">
          <div
            style="
              flex: 1;
              min-width: 220px;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 12px;
            "
          >
            <div style="font-weight: 800">
              1) Enviada
              <span v-if="steps.sentDone" style="opacity: 0.7">✓</span>
            </div>
            <div style="opacity: 0.75; margin-top: 4px; font-size: 13px">
              Sua candidatura foi registrada no sistema.
            </div>
          </div>

          <div
            style="
              flex: 1;
              min-width: 220px;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 12px;
            "
          >
            <div style="font-weight: 800">
              2) Análise da instituição
              <span v-if="steps.approvedDone" style="opacity: 0.7">✓</span>
              <span v-else-if="steps.rejectedDone" style="opacity: 0.7">✕</span>
            </div>
            <div style="opacity: 0.75; margin-top: 4px; font-size: 13px">
              A instituição aceita ou recusa sua candidatura.
            </div>
          </div>

          <div
            style="
              flex: 1;
              min-width: 220px;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 12px;
            "
          >
            <div style="font-weight: 800">
              3) Conclusão
              <span v-if="steps.completedDone" style="opacity: 0.7">✓</span>
            </div>
            <div style="opacity: 0.75; margin-top: 4px; font-size: 13px">
              Ao concluir, o certificado fica disponível.
            </div>
          </div>
        </div>
      </div>

      <!-- Documentos / Ações -->
      <div
        style="
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          background: #fff;
        "
      >
        <h2 style="margin: 0 0 10px; font-size: 18px; font-weight: 800">
          Documentos e ações
        </h2>

        <!-- Se pendente -->
        <div v-if="application && application.status === 'pending'" style="opacity: 0.8">
          Aguarde a aprovação da instituição para iniciar o fluxo de documentos.
        </div>

        <!-- Se recusada -->
        <div v-else-if="application && application.status === 'rejected'" style="opacity: 0.8">
          Esta candidatura foi recusada. Você pode explorar novas oportunidades.
          <div style="margin-top: 10px">
            <RouterLink
              to="/app/student/oportunidades"
              style="
                display: inline-block;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                text-decoration: none;
              "
            >
              Explorar oportunidades
            </RouterLink>
          </div>
        </div>

        <!-- Se aceita -->
        <div v-else-if="application && application.status === 'accepted'">
          <div style="display: flex; gap: 10px; flex-wrap: wrap">
            <button
              @click="downloadTerm"
              style="
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                background: #fff;
                cursor: pointer;
              "
            >
              Baixar termo de compromisso
            </button>

            <button
              @click="uploadSignedTerm"
              style="
                padding: 10px 12px;
                border: 1px solid #111827;
                border-radius: 10px;
                background: #111827;
                color: #fff;
                cursor: pointer;
              "
            >
              Enviar termo assinado (mock)
            </button>
          </div>

          <div style="margin-top: 12px; opacity: 0.75; font-size: 13px">
            Após o envio do termo, aguarde a validação final da instituição.
          </div>
        </div>

        <!-- Se concluída -->
        <div v-else-if="application && application.status === 'completed'">
          <div style="display: flex; gap: 10px; flex-wrap: wrap">
            <button
              @click="downloadCertificate"
              style="
                padding: 10px 12px;
                border: 1px solid #111827;
                border-radius: 10px;
                background: #111827;
                color: #fff;
                cursor: pointer;
              "
            >
              Baixar certificado (mock)
            </button>
          </div>

          <div style="margin-top: 12px; opacity: 0.75; font-size: 13px">
            Certificado disponível após conclusão da atividade.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
