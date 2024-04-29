<template>
  <v-select
    :value="value"
    :label="label"
    :items="Object.values(LOCATION_TYPES)"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  />
</template>

<script setup>
import { LOCATION_TYPES } from "@/api/travel-desk-rental-cars-api"

defineProps({
  value: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "Location Type",
  },
})

const emit = defineEmits(["input"])
</script>
