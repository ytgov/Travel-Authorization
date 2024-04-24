<template>
  <v-select
    :value="value"
    :label="label"
    :items="Object.values(VEHICLE_TYPES)"
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
})

const emit = defineEmits(["input"])
</script>
