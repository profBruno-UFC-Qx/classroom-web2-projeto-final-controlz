<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useOpportunityStore } from "../../stores/opportunity.store";
import { useApplicationStore } from "../../stores/application.store";
import { useInstitutionStore } from "../../stores/institution.store";

const opportunityStore = useOpportunityStore();
const applicationStore = useApplicationStore();
const institutionStore = useInstitutionStore();

const loading = ref(true);
const saving = ref(false);
const error = ref("");
const success = ref("");

const stats = ref({
  activeOpportunities: 0,
  totalApplications: 0,
  pendingApplications: 0,
});

const opportunities = ref<any[]>([]);
const hasProfile = ref(false);
const showProfileForm = ref(false);

const profileForm = reactive({
  name: "",
  description: "",
  address: "",
  city: "",
});

async function loadData() {
  loading.value = true;
  error.value = "";
  success.value = "";
  try {
    // carregar dados da instituição para obter o id
    const institution = await institutionStore.getMe();
    
    // se não tiver perfil (null ou undefined), mostra formulário
    if (!institution || !institutionStore.currentInstitution) {
      hasProfile.value = false;
      showProfileForm.value = true;
      loading.value = false;
      return;
    }

    hasProfile.value = true;
    showProfileForm.value = false;
    
    // preencher formulário se já tiver perfil
    profileForm.name = institution.name;
    profileForm.description = institution.description || "";
    profileForm.address = institution.address || "";
    profileForm.city = institution.city || "";

    // carregar oportunidades da instituição usando o institutionId
    const oppResult = await opportunityStore.list({ 
      institutionId: institution.id,
      limit: 100 
    });
    
    // filtrar so as oportunidades ativas
    opportunities.value = oppResult.data.filter((o) => o.isActive);
    stats.value.activeOpportunities = opportunities.value.length;

    // carregar candidaturas
    const appResult = await applicationStore.listInstitutionApplications({ limit: 100 });
    stats.value.totalApplications = appResult.data.length;
    stats.value.pendingApplications = appResult.data.filter(
      (a) => a.status === "pending"
    ).length;
  } catch (err: any) {
    error.value = institutionStore.error || applicationStore.error || opportunityStore.error || "Erro ao carregar dados";
  } finally {
    loading.value = false;
  }
}

async function saveProfile() {
  saving.value = true;
  error.value = "";
  success.value = "";

  if (!profileForm.name.trim()) {
    error.value = "O nome da instituição é obrigatório";
    saving.value = false;
    return;
  }

  try {
    await institutionStore.upsertMe({
      name: profileForm.name.trim(),
      description: profileForm.description.trim() || null,
      address: profileForm.address.trim() || null,
      city: profileForm.city.trim() || null,
    });

    success.value = "Perfil cadastrado com sucesso! Aguarde a aprovação do administrador.";
    hasProfile.value = true;
    showProfileForm.value = false;
    
    // recarrega os dados
    await loadData();
    
    setTimeout(() => {
      success.value = "";
    }, 5000);
  } catch (err: any) {
    error.value = institutionStore.error || "Erro ao cadastrar perfil";
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div style="max-width: 1100px">
    <header style="margin-bottom: 20px">
      <h1 style="font-size: 28px; font-weight: 800">
        Dashboard da Instituição
      </h1>
      <p style="opacity: 0.75">Acompanhe suas vagas e candidaturas.</p>
    </header>

    <!-- loading -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando dados...</p>
    </div>

    <!-- erro -->
    <div
      v-if="error"
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

    <!-- sucesso -->
    <div
      v-if="success"
      style="
        padding: 16px;
        background: #dcfce7;
        border: 1px solid #86efac;
        border-radius: 10px;
        color: #166534;
        margin-bottom: 20px;
      "
    >
      <strong>✓ {{ success }}</strong>
    </div>

    <!-- formulário de cadastro de perfil -->
    <div
      v-if="showProfileForm"
      style="
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
        background: #fff;
        margin-bottom: 24px;
      "
    >
      <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 8px">
        Cadastrar Perfil da Instituição
      </h2>
      <p style="opacity: 0.75; margin: 0 0 20px">
        Complete seu cadastro para começar a publicar oportunidades de voluntariado.
      </p>

      <form @submit.prevent="saveProfile" style="display: grid; gap: 16px">
        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Nome da Instituição *
          </label>
          <input
            v-model="profileForm.name"
            required
            placeholder="Ex: Projeto Semeando Futuro"
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            "
          />
        </div>

        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Descrição
          </label>
          <textarea
            v-model="profileForm.description"
            rows="4"
            placeholder="Descreva sua instituição, missão, objetivos..."
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              resize: vertical;
            "
          />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <div>
            <label
              style="
                display: block;
                font-size: 13px;
                opacity: 0.75;
                margin-bottom: 6px;
              "
            >
              Cidade
            </label>
            <input
              v-model="profileForm.city"
              placeholder="Ex: Quixadá"
              style="
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            />
          </div>

          <div>
            <label
              style="
                display: block;
                font-size: 13px;
                opacity: 0.75;
                margin-bottom: 6px;
              "
            >
              Endereço
            </label>
            <input
              v-model="profileForm.address"
              placeholder="Ex: Rua Exemplo, 123"
              style="
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            />
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; padding-top: 4px">
          <button
            type="submit"
            :disabled="saving"
            :style="{
              padding: '12px 16px',
              border: '1px solid #111827',
              borderRadius: '10px',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '700',
              opacity: saving ? 0.6 : 1,
            }"
          >
            {{ saving ? "Salvando..." : "Cadastrar Perfil" }}
          </button>
        </div>
      </form>
    </div>

    <!-- conteúdo -->
    <template v-else-if="hasProfile">
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
            {{ stats.activeOpportunities }}
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
          <strong>Pendentes</strong>
          <div style="font-size: 28px; font-weight: 800; margin-top: 6px; color: #f59e0b">
            {{ stats.pendingApplications }}
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

        <div v-if="opportunities.length === 0" style="opacity: 0.75; padding: 20px">
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
                {{ opp.category || "Sem categoria" }} • {{ opp.workloadHours }}h
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
    </template>
  </div>
</template>
