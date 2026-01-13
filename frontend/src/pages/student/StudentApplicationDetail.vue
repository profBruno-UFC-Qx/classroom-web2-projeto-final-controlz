<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  applications,
  getOpportunityById,
  type ApplicationStatus,
} from "../../data/mock";
import { useAuthStore } from "../../stores/auth.store";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// ✅ CORREÇÃO DO ERRO: sempre normalizar param para string
const applicationId = String(route.params.id);

// (mock) se seu auth não tem id real, usa um fixo por enquanto
const studentId = computed(() => auth.user?.id ?? "stu1");

const application = computed(() =>
  applications.find((a) => a.id === applicationId)
);
const opportunity = computed(() =>
  application.value
    ? getOpportunityById(application.value.opportunityId)
    : undefined
);

// 🔒 Segurança: impedir aluno ver candidatura de outro aluno (mesmo em mock)
const canAccess = computed(() => {
  if (!application.value) return false;
  return application.value.studentId === studentId.value;
});

const statusLabel = (s: ApplicationStatus) => {
  if (s === "pendente") return "Pendente";
  if (s === "aceita") return "Aceita";
  if (s === "recusada") return "Recusada";
  if (s === "concluida") return "Concluída";
  return s;
};

const statusHint = computed(() => {
  const s = application.value?.status;
  if (!s) return "";

  if (s === "pendente") {
    return "Sua candidatura foi enviada. Aguarde a análise da instituição.";
  }
  if (s === "aceita") {
    return "Parabéns! Você foi aceito. Agora siga o fluxo do termo de compromisso.";
  }
  if (s === "recusada") {
    return "Sua candidatura foi recusada. Você pode se candidatar a outras oportunidades.";
  }
  if (s === "concluida") {
    return "Atividade concluída! Seu certificado está disponível para download.";
  }
  return "";
});

// Timeline simples (3 etapas)
const steps = computed(() => {
  const s = application.value?.status;

  const sentDone = !!application.value;
  const approvedDone = s === "aceita" || s === "concluida";
  const rejectedDone = s === "recusada";
  const completedDone = s === "concluida";

  return {
    sentDone,
    approvedDone,
    rejectedDone,
    completedDone,
  };
});

// Ações mock
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

    <!-- Erros / segurança -->
    <div
      v-if="!application || !opportunity"
      style="
        padding: 18px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
      "
    >
      <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 6px">
        Candidatura não encontrada
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
            <div style="font-size: 18px; font-weight: 800">
              {{ opportunity.title }}
            </div>
            <div style="opacity: 0.75; margin-top: 4px">
              {{ opportunity.institutionName }} • {{ opportunity.city }}
            </div>
            <div style="opacity: 0.75; margin-top: 4px; font-size: 13px">
              Candidatura em: {{ application.createdAt }}
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
              {{ statusLabel(application.status) }}
            </div>
            <div style="margin-top: 8px; opacity: 0.75; font-size: 13px">
              {{ opportunity.workloadHours }}h • {{ opportunity.category }}
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
        <div v-if="application.status === 'pendente'" style="opacity: 0.8">
          Aguarde a aprovação da instituição para iniciar o fluxo de documentos.
        </div>

        <!-- Se recusada -->
        <div v-else-if="application.status === 'recusada'" style="opacity: 0.8">
          Esta candidatura foi recusada. Você pode explorar novas oportunidades.
          <div style="margin-top: 10px">
            <RouterLink
              to="/oportunidades"
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
        <div v-else-if="application.status === 'aceita'">
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
        <div v-else-if="application.status === 'concluida'">
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
