<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import OpportunityCard from "../../components/opportunities/OpportunityCard.vue";
import {
  useOpportunityStore,
  type Opportunity,
} from "../../stores/opportunity.store";

const opportunityStore = useOpportunityStore();

// Estado dos filtros de busca (controlados localmente)
const query = ref("");
const categoryFilter = ref<string>("");
const cityFilter = ref<string>("");
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Mapeia dados do backend para formato esperado pelo OpportunityCard
function mapToCardFormat(opp: Opportunity) {
  // Pegar primeiras 100 caracteres da descrição como shortDescription
  const shortDescription =
    opp.description.length > 100
      ? opp.description.substring(0, 100) + "..."
      : opp.description;

  return {
    id: opp.id,
    title: opp.title,
    institutionName: "Instituição", // TODO: buscar nome da instituição se necessário
    city: opp.city || "Não informado",
    category: opp.category || "Geral",
    workloadHours: opp.workloadHours,
    skills: [], // Backend não retorna skills, pode ser adicionado depois
    shortDescription,
    status: opp.isActive
      ? "pending"
      : ("completed" as "pending" | "accepted" | "rejected" | "completed"),
  };
}

// Lista de oportunidades no formato do card
const items = computed(() => {
  return opportunityStore.opportunities.map(mapToCardFormat);
});

// Paginação da store
const totalPages = computed(() => opportunityStore.pagination.totalPages);
const totalItems = computed(() => opportunityStore.pagination.total);

// Função para buscar oportunidades com os filtros atuais
async function fetchOpportunities() {
  try {
    await opportunityStore.list({
      isActive: true,
      page: currentPage.value,
      limit: itemsPerPage.value,
      q: query.value.trim() || undefined,
      category: categoryFilter.value || undefined,
      city: cityFilter.value || undefined,
    });
  } catch (err) {
    console.error("Erro ao carregar oportunidades:", err);
  }
}

// Carrega oportunidades iniciais ao montar o componente
onMounted(() => {
  fetchOpportunities();
});

// Recarrega quando filtros mudam (com debounce no query)
let debounceTimer: ReturnType<typeof setTimeout>;
watch([query, categoryFilter, cityFilter], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1; // Volta para primeira página ao filtrar
    fetchOpportunities();
  }, 300); // 300ms de debounce para a busca
});

// Recarrega quando página muda
watch(currentPage, () => {
  fetchOpportunities();
});

// Listas únicas de categorias e cidades para filtros
// Como não temos mais todas as oportunidades no frontend,
// estas listas precisariam vir de endpoints específicos do backend
// Por ora, vamos manter vazio e permitir digitação livre
const categories = ref<string[]>([
  "Educação",
  "Saúde",
  "Meio Ambiente",
  "Assistência Social",
  "Cultura",
  "Esporte",
]);
const cities = ref<string[]>([
  "Quixadá",
  "Fortaleza",
  "São Paulo",
  "Rio de Janeiro",
]);
</script>

<template>
  <!-- Pagina publica de listagem de oportunidades com filtros -->
  <div style="width: 100%; overflow-x: hidden">
    <!-- Cabeçalho da pagina -->
    <v-row class="mb-4">
      <v-col>
        <h2 class="text-h4 mb-2">Oportunidades</h2>
        <p class="text-body-1 text-medium-emphasis">
          Explore vagas ativas e encontre uma causa para participar.
        </p>
      </v-col>
    </v-row>

    <!-- Painel de filtros: busca, categoria e cidade -->
    <v-card class="mb-4" elevation="1">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="query"
              placeholder="Buscar por título..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="categoryFilter"
              :items="[
                { title: 'Todas as categorias', value: '' },
                ...categories.map((c) => ({ title: c, value: c })),
              ]"
              prepend-inner-icon="mdi-tag"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="cityFilter"
              :items="[
                { title: 'Todas as cidades', value: '' },
                ...cities.map((c) => ({ title: c, value: c })),
              ]"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Estado de carregamento -->
    <v-card v-if="opportunityStore.loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        class="mb-4"
      ></v-progress-circular>
      <p class="text-medium-emphasis">Carregando oportunidades...</p>
    </v-card>

    <!-- Estado de erro -->
    <v-alert v-else-if="opportunityStore.error" type="error" class="mb-4">
      {{ opportunityStore.error }}
    </v-alert>

    <!-- Grid de cards de oportunidades -->
    <v-row v-else-if="items.length > 0" class="ma-0">
      <v-col
        v-for="o in items"
        :key="o.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="pa-2"
      >
        <OpportunityCard :opportunity="o" />
      </v-col>
    </v-row>

    <!-- Paginação -->
    <v-row v-if="totalPages > 1" class="mt-4">
      <v-col class="d-flex justify-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          rounded="circle"
        ></v-pagination>
      </v-col>
    </v-row>

    <!-- Informação de resultados -->
    <v-row v-if="items.length > 0" class="mt-2">
      <v-col class="text-center text-caption text-medium-emphasis">
        Mostrando {{ items.length }} de {{ totalItems }} oportunidades
      </v-col>
    </v-row>

    <!-- Estado vazio: nenhuma oportunidade encontrada -->
    <v-card v-else class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4"
        >mdi-information-outline</v-icon
      >
      <p class="text-body-1 text-medium-emphasis">
        Nenhuma oportunidade encontrada com os filtros selecionados.
      </p>
    </v-card>
  </div>
</template>
