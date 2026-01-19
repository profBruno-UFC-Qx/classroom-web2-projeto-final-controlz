<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useApplicationStore } from "../../stores/application.store";
import { useInstitutionStore } from "../../stores/institution.store";
import { useOpportunityStore } from "../../stores/opportunity.store";

// Stores necessarias para oportunidades, candidaturas e perfil da instituicao
const opportunityStore = useOpportunityStore();
const applicationStore = useApplicationStore();
const institutionStore = useInstitutionStore();

// Estados de controle da pagina
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const success = ref("");

// Estatisticas do dashboard
const stats = ref({
  activeOpportunities: 0,
  totalApplications: 0,
  pendingApplications: 0,
});

const opportunities = ref<any[]>([]);
const hasProfile = ref(false);
const showProfileForm = ref(false);
const institutionStatus = ref<"pending" | "approved" | "rejected" | null>(null);
const showPendingWarning = ref(false);

// Formulario de cadastro/edicao de perfil
const profileForm = reactive({
  name: "",
  description: "",
  address: "",
  city: "",
});

// Carrega dados da instituicao, oportunidades e candidaturas
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
<<<<<<< HEAD

=======
    institutionStatus.value = institution.status;
    
>>>>>>> b103d3c46f0eafb5dd2b7698edff725987376ff5
    // preencher formulário se já tiver perfil
    profileForm.name = institution.name;
    profileForm.description = institution.description || "";
    profileForm.address = institution.address || "";
    profileForm.city = institution.city || "";

    // verificar se a instituição está aprovada
    if (institution.status === "pending" || institution.status === "rejected") {
      showPendingWarning.value = true;
      // nao tenta carregar candidaturas se nao estiver aprovada
      stats.value.activeOpportunities = 0;
      stats.value.totalApplications = 0;
      stats.value.pendingApplications = 0;
      opportunities.value = [];
      loading.value = false;
      return;
    }

    showPendingWarning.value = false;

    // carregar oportunidades da instituição usando o institutionId
    const oppResult = await opportunityStore.list({
      institutionId: institution.id,
      limit: 100,
    });

    // filtrar so as oportunidades ativas
    opportunities.value = oppResult.data.filter((o) => o.isActive);
    stats.value.activeOpportunities = opportunities.value.length;

<<<<<<< HEAD
    // carregar candidaturas
    const appResult = await applicationStore.listInstitutionApplications({
      limit: 100,
    });
    stats.value.totalApplications = appResult.data.length;
    stats.value.pendingApplications = appResult.data.filter(
      (a) => a.status === "pending"
    ).length;
  } catch (err: any) {
    error.value =
      institutionStore.error ||
      applicationStore.error ||
      opportunityStore.error ||
      "Erro ao carregar dados";
=======
    // carregar candidaturas apenas se estiver aprovada
    try {
      const appResult = await applicationStore.listInstitutionApplications({ limit: 100 });
      stats.value.totalApplications = appResult.data.length;
      stats.value.pendingApplications = appResult.data.filter(
        (a) => a.status === "pending"
      ).length;
    } catch (err: any) {
      // se der erro 403 (não aprovada), não é um erro crítico, apenas não mostra candidaturas
      if (err?.response?.status === 403) {
        stats.value.totalApplications = 0;
        stats.value.pendingApplications = 0;
      } else {
        // outros erros sao tratados no catch geral
        throw err;
      }
    }
  } catch (err: any) {
    if (err?.response?.status === 403 && showPendingWarning.value) {
      // ja tratado acima, nao precisa mostrar erro
    } else {
      error.value = institutionStore.error || applicationStore.error || opportunityStore.error || "Erro ao carregar dados";
    }
>>>>>>> b103d3c46f0eafb5dd2b7698edff725987376ff5
  } finally {
    loading.value = false;
  }
}

// Salva ou atualiza perfil da instituicao
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

    success.value =
      "Perfil cadastrado com sucesso! Aguarde a aprovação do administrador.";
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

// Carrega dados ao montar o componente
onMounted(() => {
  loadData();
});
</script>

<template>
  <!-- Dashboard privado da instituicao -->
  <div>
    <!-- Cabecalho da pagina -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">Dashboard da Instituição</h1>
        <p class="text-body-1 text-medium-emphasis">
          Acompanhe suas vagas e candidaturas.
        </p>
      </v-col>
    </v-row>

    <!-- Estado de carregamento -->
    <v-card v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mb-4"
      ></v-progress-circular>
      <p class="text-medium-emphasis">Carregando dados...</p>
    </v-card>

    <!-- Mensagem de erro -->
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Mensagem de sucesso -->
    <v-alert
      v-if="success"
      type="success"
      class="mb-4"
      closable
      @click:close="success = ''"
    >
      {{ success }}
    </v-alert>

<<<<<<< HEAD
    <!-- Formulario de cadastro inicial de perfil (se nao existir) -->
=======
    <!-- aviso de pendência de aprovação -->
    <v-alert
      v-if="showPendingWarning && institutionStatus === 'pending'"
      type="warning"
      class="mb-4"
      variant="tonal"
      prominent
    >
      <template v-slot:prepend>
        <v-icon>mdi-clock-outline</v-icon>
      </template>
      <div class="text-h6 mb-2 font-weight-bold">Aguardando Aprovação</div>
      <div>
        Seu cadastro está aguardando aprovação do administrador. 
        Você poderá criar vagas e gerenciar candidaturas assim que seu perfil for aprovado.
      </div>
    </v-alert>

    <!-- aviso de rejeição -->
    <v-alert
      v-if="showPendingWarning && institutionStatus === 'rejected'"
      type="error"
      class="mb-4"
      variant="tonal"
      prominent
    >
      <template v-slot:prepend>
        <v-icon>mdi-alert-circle</v-icon>
      </template>
      <div class="text-h6 mb-2 font-weight-bold">Cadastro Rejeitado</div>
      <div>
        Seu cadastro foi rejeitado pelo administrador. 
        Entre em contato com a administração para mais informações.
      </div>
    </v-alert>

    <!-- formulário de cadastro de perfil -->
>>>>>>> b103d3c46f0eafb5dd2b7698edff725987376ff5
    <v-card v-if="showProfileForm" class="mb-4" elevation="2">
      <v-card-title class="text-h5 mb-2">
        Cadastrar Perfil da Instituição
      </v-card-title>
      <v-card-subtitle class="mb-4">
        Complete seu cadastro para começar a publicar oportunidades de
        voluntariado.
      </v-card-subtitle>
      <v-card-text>
        <v-form @submit.prevent="saveProfile">
          <v-text-field
            v-model="profileForm.name"
            label="Nome da Instituição"
            prepend-inner-icon="mdi-office-building"
            placeholder="Ex: Projeto Semeando Futuro"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-textarea
            v-model="profileForm.description"
            label="Descrição"
            prepend-inner-icon="mdi-text"
            placeholder="Descreva sua instituição, missão, objetivos..."
            rows="4"
            class="mb-3"
            variant="outlined"
          ></v-textarea>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profileForm.city"
                label="Cidade"
                prepend-inner-icon="mdi-map-marker"
                placeholder="Ex: Quixadá"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profileForm.address"
                label="Endereço"
                prepend-inner-icon="mdi-home"
                placeholder="Ex: Rua Exemplo, 123"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="d-flex justify-end mt-4">
            <v-btn
              type="submit"
              :loading="saving"
              color="primary"
              size="large"
              prepend-icon="mdi-content-save"
            >
              {{ saving ? "Salvando..." : "Cadastrar Perfil" }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Conteudo principal do dashboard (se perfil ja existe) -->
    <template v-else-if="hasProfile">
      <!-- Cards de estatisticas -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-card elevation="2">
            <v-card-text>
              <div class="text-caption text-medium-emphasis mb-2">
                Vagas ativas
              </div>
              <div class="text-h4 font-weight-bold">
                {{ stats.activeOpportunities }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card elevation="2">
            <v-card-text>
              <div class="text-caption text-medium-emphasis mb-2">
                Total de candidaturas
              </div>
              <div class="text-h4 font-weight-bold">
                {{ stats.totalApplications }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card elevation="2" color="warning" variant="tonal">
            <v-card-text>
              <div class="text-caption text-medium-emphasis mb-2">
                Pendentes
              </div>
              <div class="text-h4 font-weight-bold">
                {{ stats.pendingApplications }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Botoes de acao rapida -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6">
          <v-btn
            :to="institutionStatus === 'approved' ? '/app/institution/vagas/nova' : undefined"
            :disabled="institutionStatus !== 'approved'"
            block
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
          >
            Criar nova vaga
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            :to="institutionStatus === 'approved' ? '/app/institution/vagas' : undefined"
            :disabled="institutionStatus !== 'approved'"
            block
            variant="outlined"
            size="large"
            prepend-icon="mdi-briefcase"
          >
            Minhas vagas
          </v-btn>
        </v-col>
      </v-row>

      <!-- Lista das ultimas vagas criadas -->
      <v-card elevation="2">
        <v-card-title class="text-h6">Últimas vagas</v-card-title>
        <v-card-text v-if="opportunities.length === 0" class="text-center pa-8">
          <p class="text-medium-emphasis">Nenhuma vaga criada ainda.</p>
        </v-card-text>
        <v-list v-else>
          <v-list-item
            v-for="opp in opportunities.slice(0, 5)"
            :key="opp.id"
            :title="opp.title"
            :subtitle="`${opp.category || 'Sem categoria'} • ${
              opp.workloadHours
            }h`"
          >
            <template v-slot:append>
              <v-btn
                :to="`/app/institution/vagas/${String(opp.id)}`"
                variant="text"
                prepend-icon="mdi-cog"
              >
                Gerenciar
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </div>
</template>
