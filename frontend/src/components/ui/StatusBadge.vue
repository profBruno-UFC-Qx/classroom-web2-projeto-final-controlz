<script setup lang="ts">
import { computed } from "vue";

// Tipos validos de status para o badge
type Status = "pending" | "accepted" | "rejected" | "completed";

// Props do componente: recebe o status a ser exibido
const props = defineProps<{
  status: Status;
}>();

// Retorna texto traduzido para o status
const label = computed(() => {
  switch (props.status) {
    case "pending":
      return "Pendente";
    case "accepted":
      return "Aceita";
    case "rejected":
      return "Recusada";
    case "completed":
      return "Concluída";
  }
});

// Retorna icone adequado para cada status
const icon = computed(() => {
  switch (props.status) {
    case "pending":
      return "mdi-clock";
    case "accepted":
      return "mdi-check-circle";
    case "rejected":
      return "mdi-close-circle";
    case "completed":
      return "mdi-check-all";
    default:
      return "";
  }
});

// Retorna cor tematica para cada status
const color = computed(() => {
  switch (props.status) {
    case "pending":
      return "warning";
    case "accepted":
      return "info";
    case "rejected":
      return "error";
    case "completed":
      return "success";
    default:
      return "grey";
  }
});
</script>

<template>
  <v-chip :color="color" size="small" :prepend-icon="icon">
    {{ label }}
  </v-chip>
</template>
