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

const badgeStyle = computed(() => {
    const base = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid #e5e7eb",
    } as Record<string, string>;

    const colors: Record<Status, Record<string, string>> = {
    pending: { background: "#FEF3C7" },
    accepted: { background: "#DBEAFE" },
    rejected: { background: "#FEE2E2" },
    completed: { background: "#D1FAE5" },
    };

    return { ...base, ...colors[props.status] };
});
</script>

<template>
    <span :style="badgeStyle">{{ label }}</span>
</template>
