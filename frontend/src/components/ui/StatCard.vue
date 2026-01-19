<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  color?: string;
  variant?: "tonal" | "flat" | "elevated" | "outlined" | "text" | "plain";
  elevation?: number | string;
}

defineProps<Props>();
</script>

<template>
  <v-card
    :color="color"
    :variant="variant || 'flat'"
    :elevation="elevation ?? 2"
    class="stat-card"
  >
    <v-card-text class="py-4">
      <div class="text-caption text-medium-emphasis mb-2">
        {{ title }}
      </div>
      <div class="text-h4 font-weight-bold">
        <slot name="value">
          {{ value }}
        </slot>
      </div>
      <div v-if="$slots.default" class="text-body-2 mt-2 text-medium-emphasis">
        <slot />
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.stat-card {
  min-height: 120px;
}
</style>
