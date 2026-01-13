<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { useOpportunityStore } from "../../stores/opportunity.store";
import { useApplicationStore } from "../../stores/application.store";

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const opportunityStore = useOpportunityStore();
const applicationStore = useApplicationStore();

const { isAuthenticated, role } = storeToRefs(authStore);
const opportunityId = String(route.params.id);

// verifica se ta na rota protegida do aluno
const isStudentRoute = computed(() => route.path.startsWith("/app/student"));
const opportunitiesLink = computed(() => 
  isStudentRoute.value ? "/app/student/oportunidades" : "/oportunidades"
);

const isApplying = ref(false);
const applyError = ref("");
const applySuccess = ref(false);
const hasApplied = ref(false);

// verificar se já tá candidatado
const checkIfApplied = async () => {
  if (!isAuthenticated.value || role.value !== "aluno") return;
  
  try {
    const result = await applicationStore.listMyApplications({ opportunityId });
    hasApplied.value = result.data.length > 0;
  } catch (err) {
    // ignora erro, apenas não marca como candidatado
  }
};

const opportunity = computed(() => opportunityStore.currentOpportunity);

onMounted(async () => {
  try {
    await opportunityStore.getById(opportunityId);
    await checkIfApplied();
  } catch (err: any) {
    console.error("Erro ao carregar oportunidade:", err);
  }
});

async function apply() {
  if (!isAuthenticated.value || role.value !== "aluno") {
    router.push("/login");
    return;
  }

  isApplying.value = true;
  applyError.value = "";
  applySuccess.value = false;

  try {
    await applicationStore.apply(opportunityId);
    applySuccess.value = true;
    hasApplied.value = true;
    
    // redireciona após 2 segundos
    setTimeout(() => {
      router.push("/app/student/candidaturas");
    }, 2000);
  } catch (err: any) {
    applyError.value = applicationStore.error || "Erro ao se candidatar. Tente novamente.";
  } finally {
    isApplying.value = false;
  }
}
</script>

<template>
  <div style="max-width: 720px">
    <!-- loading -->
    <div v-if="opportunityStore.loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando oportunidade...</p>
    </div>

    <!-- erro -->
    <div
      v-else-if="opportunityStore.error || !opportunity"
      style="
        padding: 20px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 10px;
        color: #c33;
      "
    >
      <h2 style="margin: 0 0 8px">Oportunidade não encontrada</h2>
      <p style="margin: 0; opacity: 0.8">
        {{ opportunityStore.error || "A oportunidade que você está procurando não existe ou foi removida." }}
      </p>
      <RouterLink
        :to="opportunitiesLink"
        style="
          display: inline-block;
          margin-top: 12px;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          text-decoration: none;
        "
      >
        Voltar para oportunidades
      </RouterLink>
    </div>

    <!-- conteúdo -->
    <div v-else>
      <h1 style="margin: 10px 0 4px">{{ opportunity.title }}</h1>

      <div style="opacity: 0.8; margin-bottom: 10px">
        {{ opportunity.city || "Cidade não informada" }}
        <span v-if="opportunity.category"> • {{ opportunity.category }}</span>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px">
        <span
          v-if="opportunity.category"
          style="background: #f3f4f6; padding: 4px 10px; border-radius: 999px; font-size: 13px"
        >
          {{ opportunity.category }}
        </span>
        <span
          style="background: #f3f4f6; padding: 4px 10px; border-radius: 999px; font-size: 13px"
        >
          {{ opportunity.workloadHours }}h
        </span>
        <span
          v-if="opportunity.isActive"
          style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 13px"
        >
          Ativa
        </span>
        <span
          v-else
          style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 999px; font-size: 13px"
        >
          Inativa
        </span>
      </div>

      <div
        style="
          padding: 16px;
          background: #f9fafb;
          border-radius: 10px;
          margin-bottom: 16px;
        "
      >
        <h3 style="margin: 0 0 8px; font-size: 16px">Descrição</h3>
        <p style="font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap">
          {{ opportunity.description }}
        </p>
      </div>

      <!-- ações de candidatura -->
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb">
        <!-- sucesso -->
        <div
          v-if="applySuccess"
          style="
            padding: 16px;
            background: #dcfce7;
            border: 1px solid #86efac;
            border-radius: 10px;
            color: #166534;
            margin-bottom: 16px;
          "
        >
          <strong>✓ Candidatura realizada com sucesso!</strong>
          <p style="margin: 8px 0 0; opacity: 0.8">
            Redirecionando para suas candidaturas...
          </p>
        </div>

        <!-- erro -->
        <div
          v-else-if="applyError"
          style="
            padding: 16px;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 10px;
            color: #c33;
            margin-bottom: 16px;
          "
        >
          {{ applyError }}
        </div>

        <!-- botões de ação -->
        <div v-if="!applySuccess">
          <RouterLink
            v-if="!isAuthenticated"
            to="/login"
            style="
              display: inline-block;
              padding: 12px 16px;
              border: 1px solid #111827;
              border-radius: 10px;
              background: #111827;
              color: #fff;
              text-decoration: none;
              font-weight: 700;
            "
          >
            Fazer login para se candidatar
          </RouterLink>

          <div v-else-if="role !== 'aluno'" style="opacity: 0.75">
            Apenas alunos podem se candidatar a vagas.
          </div>

          <div v-else-if="hasApplied" style="opacity: 0.75">
            <p style="margin: 0 0 12px">
              Você já se candidatou a esta oportunidade.
            </p>
            <RouterLink
              to="/app/student/candidaturas"
              style="
                display: inline-block;
                padding: 10px 14px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                text-decoration: none;
              "
            >
              Ver minhas candidaturas
            </RouterLink>
          </div>

          <button
            v-else
            type="button"
            @click="apply"
            :disabled="isApplying || !opportunity.isActive"
            style="
              padding: 12px 16px;
              border: 1px solid #111827;
              border-radius: 10px;
              background: #111827;
              color: #fff;
              cursor: pointer;
              font-weight: 700;
              min-width: 150px;
            "
          >
            {{ isApplying ? "Candidatando..." : "Candidatar-se" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
