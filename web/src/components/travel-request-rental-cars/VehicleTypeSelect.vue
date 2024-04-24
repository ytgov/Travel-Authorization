<template>
  <v-select
    :value="value"
    :label="label"
    :items="items"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  />
</template>

<script setup>
import { VEHICLE_TYPES } from "@/api/travel-desk-rental-cars-api"

defineProps({
  value: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "Vehicle Type",
  },
  items: {
    type: Array,
    default: () => Object.values(VEHICLE_TYPES),
  },
})

const emit = defineEmits(["input"])
</script>
