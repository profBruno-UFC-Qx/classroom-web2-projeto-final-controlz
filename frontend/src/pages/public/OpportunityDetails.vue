<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";

const route = useRoute();

const authStore = useAuthStore();
const { isAuthenticated, role } = storeToRefs(authStore);

const opportunity = {
  id: route.params.id,
  title: "Apoio escolar em reforço de matemática",
  institutionName: "Projeto Semeando Futuro",
  city: "Quixadá",
  category: "Educação",
  workloadHours: 40,
  description:
    "A oportunidade consiste em auxiliar alunos do ensino básico com dificuldades em matemática, promovendo atividades semanais supervisionadas.",
  skills: ["Comunicação", "Didática", "Paciência"],
};

function apply() {
  alert("Candidatura realizada (mock).");
}
</script>

<template>
<div style="max-width: 720px">
    <h1 style="margin: 10px 0 4px">{{ opportunity.title }}</h1>

    <div style="opacity: 0.8; margin-bottom: 10px">
        {{ opportunity.institutionName }} • {{ opportunity.city }}
    </div>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px">
    <span
        style="background: #f3f4f6; padding: 4px 10px; border-radius: 999px"
    >
        {{ opportunity.category }}
    </span>
    <span
        style="background: #f3f4f6; padding: 4px 10px; border-radius: 999px"
    >
        {{ opportunity.workloadHours }}h
    </span>
    </div>

    <p style="font-size: 15px; line-height: 1.5">
        {{ opportunity.description }}
    </p>

    <h3 style="margin-top: 16px">Habilidades desejadas</h3>
    <ul>
    <li v-for="skill in opportunity.skills" :key="skill">{{ skill }}</li>
    </ul>

    <div style="margin-top: 18px">
    <RouterLink
        v-if="!isAuthenticated"
        to="/login"
        style="
        display: inline-block;
        padding: 10px 14px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        text-decoration: none;
        "
    >
        Fazer login para se candidatar
    </RouterLink>

    <button v-else-if="role === 'student'" type="button" @click="apply">
        Candidatar-se
    </button>

    <div v-else>Apenas alunos podem se candidatar a vagas.</div>
    </div>
</div>
</template>
