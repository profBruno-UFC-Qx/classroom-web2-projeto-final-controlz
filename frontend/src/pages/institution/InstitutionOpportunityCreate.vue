<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useOpportunityStore } from "../../stores/opportunity.store";
import { useInstitutionStore } from "../../stores/institution.store";

const router = useRouter();
const opportunityStore = useOpportunityStore();
const institutionStore = useInstitutionStore();

const form = reactive({
  title: "",
  category: "Educação",
  city: "",
  workloadHours: 10,
  description: "",
});

const error = ref("");
const success = ref(false);
const checkingProfile = ref(true);

const categories = [
  "Educação",
  "Meio Ambiente",
  "Saúde",
  "Cultura",
  "Direitos",
];

// verifica se a instituição tem perfil cadastrado e está aprovada
onMounted(async () => {
  checkingProfile.value = true;
  try {
    const institution = await institutionStore.getMe();
    
    // verifica se a instituição está aprovada
    if (institution.status !== "approved") {
      if (institution.status === "pending") {
        error.value = "Sua instituição ainda não foi aprovada pelo administrador. Aguarde a aprovação para criar vagas.";
      } else if (institution.status === "rejected") {
        error.value = "Sua instituição foi rejeitada. Entre em contato com o administrador para mais informações.";
      }
    }
  } catch (err: any) {
    // se nao tiver perfil, mostra mensagem
    if (err?.response?.status === 404) {
      error.value = "Você precisa cadastrar o perfil da instituição antes de criar vagas. Acesse o dashboard para cadastrar.";
    } else {
      error.value = institutionStore.error || "Erro ao verificar perfil da instituição.";
    }
  } finally {
    checkingProfile.value = false;
  }
});

async function submit() {
  error.value = "";
  success.value = false;

  // verifica novamente o status antes de criar
  try {
    const institution = await institutionStore.getMe();
    if (institution.status !== "approved") {
      if (institution.status === "pending") {
        error.value = "Sua instituição ainda não foi aprovada pelo administrador. Aguarde a aprovação para criar vagas.";
      } else if (institution.status === "rejected") {
        error.value = "Sua instituição foi rejeitada. Entre em contato com o administrador para mais informações.";
      }
      return;
    }
  } catch (err: any) {
    error.value = "Erro ao verificar status da instituição. Tente novamente.";
    return;
  }

  if (!form.title.trim() || !form.description.trim() || !form.city.trim()) {
    error.value = "Preencha todos os campos obrigatórios";
    return;
  }

  if (form.workloadHours < 1) {
    error.value = "A carga horária deve ser maior que zero";
    return;
  }

  try {
    await opportunityStore.create({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category || null,
      city: form.city.trim() || null,
      workloadHours: form.workloadHours || 0,
      isActive: true,
    });

    success.value = true;
    
    // redireciona após 1 segundo
    setTimeout(() => {
      router.push({ name: "institution_opportunities" });
    }, 1000);
  } catch (err: any) {
    // mostra a mensagem específica do backend
    let errorMessage = err?.response?.data?.message || opportunityStore.error || "Erro ao criar vaga. Tente novamente.";
    
    // traduz mensagens comuns do backend para português mais claro
    if (errorMessage.includes("não cadastrou o perfil") || errorMessage.includes("Instituição ainda não cadastrou")) {
      errorMessage = "Você precisa cadastrar o perfil da instituição antes de criar vagas. Acesse o dashboard para cadastrar.";
    } else if (errorMessage.includes("não aprovada") || errorMessage.includes("não aprovada pelo admin")) {
      errorMessage = "Sua instituição ainda não foi aprovada pelo administrador. Aguarde a aprovação para criar vagas.";
    } else if (errorMessage.includes("403") || errorMessage.includes("Sem permissão")) {
      errorMessage = "Você não tem permissão para criar vagas. Verifique se sua instituição está aprovada.";
    }
    
    error.value = errorMessage;
    console.error("Erro ao criar vaga:", err);
  }
}

function cancel() {
  router.push({ name: "institution_opportunities" });
}
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 mb-2">Criar Vaga</h1>
        <p class="text-body-1 text-medium-emphasis">
          Preencha as informações para publicar uma nova oportunidade.
        </p>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <!-- verificando perfil -->
      <v-card-text v-if="checkingProfile" class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
        <p class="text-medium-emphasis">Verificando perfil da instituição...</p>
      </v-card-text>

      <v-card-text v-else>
        <v-form @submit.prevent="submit">
          <!-- mensagem de sucesso -->
          <v-alert v-if="success" type="success" class="mb-4">
            <strong>✓ Vaga criada com sucesso!</strong>
            <div class="mt-2">Redirecionando...</div>
          </v-alert>

          <!-- mensagem de erro -->
          <v-alert v-else-if="error" type="error" class="mb-4" closable @click:close="error = ''">
            <div class="mb-2">{{ error }}</div>
            <v-btn
              v-if="error.includes('cadastrar o perfil') || error.includes('não aprovada')"
              to="/app/institution/dashboard"
              color="error"
              variant="outlined"
              size="small"
              prepend-icon="mdi-arrow-left"
            >
              Ir para Dashboard
            </v-btn>
          </v-alert>

          <v-text-field
            v-model="form.title"
            label="Título"
            prepend-inner-icon="mdi-format-title"
            placeholder="Ex: Apoio escolar em reforço de matemática"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.category"
                :items="categories"
                label="Categoria"
                prepend-inner-icon="mdi-tag"
                required
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.workloadHours"
                label="Carga horária (h)"
                type="number"
                prepend-inner-icon="mdi-clock-outline"
                min="1"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.city"
            label="Cidade"
            prepend-inner-icon="mdi-map-marker"
            placeholder="Ex: Quixadá"
            required
            class="mb-3"
            variant="outlined"
          ></v-text-field>

          <v-textarea
            v-model="form.description"
            label="Descrição"
            prepend-inner-icon="mdi-text"
            placeholder="Descreva o que o voluntário fará, dias/horários, detalhes..."
            rows="5"
            required
            class="mb-4"
            variant="outlined"
          ></v-textarea>

          <div class="d-flex justify-end gap-2">
            <v-btn
              type="button"
              variant="outlined"
              @click="cancel"
            >
              Cancelar
            </v-btn>
            <v-btn
              type="submit"
              :loading="opportunityStore.loading"
              :disabled="success"
              color="primary"
              prepend-icon="mdi-plus"
            >
              {{ opportunityStore.loading ? "Criando..." : success ? "Criada!" : "Criar vaga" }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
