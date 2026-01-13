<script setup lang="ts">
    import { computed, ref } from "vue";
    import OpportunityCard, { type Opportunity } from "../../components/opportunities/OpportunityCard.vue";

    
    const query = ref("");
    
    const items = ref<Opportunity[]>([
    {
        id: 1,
        title: "Apoio escolar em reforço de matemática",
        institutionName: "Projeto Semeando Futuro",
        city: "Quixadá",
        category: "Educação",
        workloadHours: 40,
        skills: ["Comunicação", "Paciência"],
        shortDescription: "Apoie estudantes do ensino básico com reforço semanal e atividades guiadas.",
        status: "pending",
    },
    {
        id: 2,
        title: "Campanha solidária de arrecadação",
        institutionName: "Casa Acolher",
        city: "Fortaleza",
        category: "Social",
        workloadHours: 20,
        skills: ["Organização", "Trabalho em equipe"],
        shortDescription: "Ajude na triagem, organização e logística de doações para famílias assistidas.",
        status: "accepted",
    },
    {
        id: 3,
        title: "Mutirão de limpeza ambiental",
        institutionName: "VerdeVivo",
        city: "Quixadá",
        category: "Meio Ambiente",
        workloadHours: 10,
        skills: ["Proatividade"],
        shortDescription: "Participe de um mutirão em áreas públicas com foco em educação ambiental.",
        status: "completed",
    },
    ]);
    
    const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return items.value;
    return items.value.filter((o) => o.title.toLowerCase().includes(q));
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
    "
    >
    <div>
        <h2 style="margin: 0">Oportunidades</h2>
        <p style="margin: 6px 0 0; opacity: 0.8">
        Explore vagas ativas e encontre uma causa para participar.
        </p>
    </div>

    <input
        v-model="query"
        placeholder="Buscar por título..."
        style="
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        min-width: 260px;
        "
    />
    </div>

    <div
    style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 12px;
        margin-top: 14px;
    "
    >
    <OpportunityCard v-for="o in filtered" :key="o.id" :opportunity="o" />
    </div>

    <div
    v-if="filtered.length === 0"
    style="
        margin-top: 14px;
        padding: 14px;
        border: 1px dashed #e5e7eb;
        border-radius: 12px;
    "
    >
    Nenhuma oportunidade encontrada com esse termo.
    </div>
</div>
</template>
