<script setup lang="ts">
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

defineProps<{
    opportunity: Opportunity;
}>();
</script>

<template>
    <article
    style="
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: white;
    "
    >
    <div style="display:flex; justify-content:space-between; gap:10px;">
        <div>
        <h3 style="margin:0; font-size:16px;">{{ opportunity.title }}</h3>
        <div style="font-size:13px; opacity:.75; margin-top:2px;">
            {{ opportunity.institutionName }} • {{ opportunity.city }}
        </div>
        </div>

        <div style="text-align:right; font-size:13px;">
        <div style="font-weight:700;">{{ opportunity.workloadHours }}h</div>
        <div style="opacity:.75;">carga horária</div>
        </div>
    </div>

    <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <span
        style="font-size:12px; padding:4px 8px; border-radius:999px; background:#F3F4F6;"
        >
        {{ opportunity.category }}
        </span>

        <span
        v-for="skill in opportunity.skills"
        :key="skill"
        style="font-size:12px; padding:4px 8px; border-radius:999px; background:#F3F4F6;"
        >
        {{ skill }}
        </span>
    </div>

    <p style="margin:0; font-size:14px; opacity:.9;">
        {{ opportunity.shortDescription }}
    </p>

    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:4px;">
        <StatusBadge :status="opportunity.status" />
        <RouterLink :to="`/oportunidades/${opportunity.id}`">Ver detalhes →</RouterLink>
    </div>
    </article>
</template>