<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useOpportunityStore, type Opportunity } from "../../stores/opportunity.store";
import OpportunityCard from "../../components/opportunities/OpportunityCard.vue";

const opportunityStore = useOpportunityStore();

const query = ref("");
const categoryFilter = ref<string>("");
const cityFilter = ref<string>("");

// Mapear dados do backend para o formato esperado pelo OpportunityCard
function mapToCardFormat(opp: Opportunity) {
  // Pegar primeiras 100 caracteres da descrição como shortDescription
  const shortDescription = opp.description.length > 100 
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
    status: opp.isActive ? "pending" : "completed" as "pending" | "accepted" | "rejected" | "completed",
  };
}

const items = computed(() => {
  return opportunityStore.opportunities.map(mapToCardFormat);
});

const filtered = computed(() => {
  let result = items.value;
  
  // Filtro de busca por título
  const q = query.value.trim().toLowerCase();
  if (q) {
    result = result.filter((o) => o.title.toLowerCase().includes(q));
  }
  
  // Filtro por categoria
  if (categoryFilter.value) {
    result = result.filter((o) => o.category === categoryFilter.value);
  }
  
  // Filtro por cidade
  if (cityFilter.value) {
    result = result.filter((o) => o.city === cityFilter.value);
  }
  
  return result;
});

// Lista de categorias únicas para o filtro
const categories = computed(() => {
  const cats = new Set(items.value.map((o) => o.category));
  return Array.from(cats).sort();
});

// Lista de cidades únicas para o filtro
const cities = computed(() => {
  const citiesList = new Set(items.value.map((o) => o.city).filter(Boolean));
  return Array.from(citiesList).sort();
});

onMounted(async () => {
  try {
    await opportunityStore.list({ isActive: true, limit: 50 });
  } catch (err) {
    console.error("Erro ao carregar oportunidades:", err);
  }
});
</script>
    
<template>
  <div style="width: 100%; overflow-x: hidden;">
    <v-row class="mb-4">
      <v-col>
        <h2 class="text-h4 mb-2">Oportunidades</h2>
        <p class="text-body-1 text-medium-emphasis">
          Explore vagas ativas e encontre uma causa para participar.
        </p>
      </v-col>
    </v-row>

    <!-- Filtros -->
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
              :items="[{ title: 'Todas as categorias', value: '' }, ...categories.map(c => ({ title: c, value: c }))]"
              prepend-inner-icon="mdi-tag"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="cityFilter"
              :items="[{ title: 'Todas as cidades', value: '' }, ...cities.map(c => ({ title: c, value: c }))]"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-card v-if="opportunityStore.loading" class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
      <p class="text-medium-emphasis">Carregando oportunidades...</p>
    </v-card>

    <!-- Erro -->
    <v-alert v-else-if="opportunityStore.error" type="error" class="mb-4">
      {{ opportunityStore.error }}
    </v-alert>

    <!-- Lista de oportunidades -->
    <v-row v-else-if="filtered.length > 0" class="ma-0">
      <v-col
        v-for="o in filtered"
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

    <!-- Sem resultados -->
    <v-card v-else class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-information-outline</v-icon>
      <p class="text-body-1 text-medium-emphasis">
        Nenhuma oportunidade encontrada com os filtros selecionados.
      </p>
    </v-card>
  </div>
</template>
