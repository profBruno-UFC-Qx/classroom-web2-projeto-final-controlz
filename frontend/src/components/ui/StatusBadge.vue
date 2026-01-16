<script setup lang="ts">
import { computed } from "vue";

type Status = "pending" | "accepted" | "rejected" | "completed";

const props = defineProps<{
  status: Status;
}>();

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
