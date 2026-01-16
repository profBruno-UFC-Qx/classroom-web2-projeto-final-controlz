<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import StatusBadge from "../ui/StatusBadge.vue";

export type Opportunity = {
    id: number | string;
    title: string;
    institutionName: string;
    city: string;
    category: string;
    workloadHours: number;
    skills: string[];
    shortDescription: string;
    status: "pending" | "accepted" | "rejected" | "completed";
};

const props = defineProps<{
    opportunity: Opportunity;
}>();

const route = useRoute();

// Verifica se está na rota protegida do aluno
const isStudentRoute = computed(() => route.path.startsWith("/app/student"));
const opportunityLink = computed(() => 
  isStudentRoute.value 
    ? `/app/student/oportunidades/${props.opportunity.id}` 
    : `/oportunidades/${props.opportunity.id}`
);
</script>

<template>
  <v-card class="mb-4 h-100 d-flex flex-column" elevation="2" style="overflow: hidden;">
    <v-card-title class="pa-4 pb-2">
      <div class="w-100">
        <div class="text-h6 mb-2" :title="opportunity.title" style="word-break: break-word; line-height: 1.4; hyphens: auto;">
          {{ opportunity.title }}
        </div>
        <div class="d-flex justify-space-between align-items-center flex-wrap" style="gap: 8px;">
          <div class="text-caption text-medium-emphasis d-flex flex-wrap align-center" style="gap: 8px;">
            <span class="d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-office-building</v-icon>
              <span class="text-truncate" style="max-width: 120px;">{{ opportunity.institutionName }}</span>
            </span>
            <span class="d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
              <span class="text-truncate" style="max-width: 100px;">{{ opportunity.city }}</span>
            </span>
          </div>
          <div class="text-right">
            <div class="text-h6 text-primary d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
              {{ opportunity.workloadHours }}h
            </div>
            <div class="text-caption text-medium-emphasis">carga horária</div>
          </div>
        </div>
      </div>
    </v-card-title>

    <v-card-text class="flex-grow-1 pa-4 pt-2">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <v-chip size="small" color="primary" variant="outlined">
          {{ opportunity.category }}
        </v-chip>
        <v-chip
          v-for="skill in opportunity.skills"
          :key="skill"
          size="small"
          variant="outlined"
        >
          <v-icon start size="small">mdi-tag</v-icon>
          {{ skill }}
        </v-chip>
      </div>

      <p class="text-body-2 mb-0" style="word-break: break-word; overflow-wrap: break-word; line-height: 1.5; hyphens: auto;">
        {{ opportunity.shortDescription }}
      </p>
    </v-card-text>

    <v-card-actions class="pa-4 pt-2 d-flex justify-space-between flex-wrap" style="gap: 8px;">
      <StatusBadge :status="opportunity.status" />
      <v-btn
        :to="opportunityLink"
        variant="text"
        color="primary"
        append-icon="mdi-arrow-right"
        size="small"
      >
        Ver detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.min-width-0 {
  min-width: 0;
}

.text-break {
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>