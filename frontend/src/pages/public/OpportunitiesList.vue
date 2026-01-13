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
  <div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      "
    >
      <div>
        <h2 style="margin: 0">Oportunidades</h2>
        <p style="margin: 6px 0 0; opacity: 0.8">
          Explore vagas ativas e encontre uma causa para participar.
        </p>
      </div>
    </div>

    <!-- Filtros -->
    <div
      style="
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 16px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 10px;
      "
    >
      <input
        v-model="query"
        placeholder="Buscar por título..."
        style="
          flex: 1;
          min-width: 200px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        "
      />
      <select
        v-model="categoryFilter"
        style="
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          min-width: 150px;
        "
      >
        <option value="">Todas as categorias</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <select
        v-model="cityFilter"
        style="
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          min-width: 150px;
        "
      >
        <option value="">Todas as cidades</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="opportunityStore.loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando oportunidades...</p>
    </div>

    <!-- Erro -->
    <div
      v-else-if="opportunityStore.error"
      style="
        padding: 16px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 10px;
        color: #c33;
        margin-bottom: 16px;
      "
    >
      {{ opportunityStore.error }}
    </div>

    <!-- Lista de oportunidades -->
    <div
      v-else-if="filtered.length > 0"
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 12px;
      "
    >
      <OpportunityCard v-for="o in filtered" :key="o.id" :opportunity="o" />
    </div>

    <!-- Sem resultados -->
    <div
      v-else
      style="
        margin-top: 14px;
        padding: 40px;
        border: 1px dashed #e5e7eb;
        border-radius: 12px;
        text-align: center;
      "
    >
      <p style="opacity: 0.75; margin: 0">
        Nenhuma oportunidade encontrada com os filtros selecionados.
      </p>
    </div>
  </div>
</template>
