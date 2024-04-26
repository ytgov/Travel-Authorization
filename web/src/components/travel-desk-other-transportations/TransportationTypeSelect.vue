<template>
  <v-select
    :value="value"
    :label="label"
    :items="transportationTypes"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  />
</template>

<script setup>
import { TRANSPORTATION_TYPES } from "@/api/travel-desk-other-transportations-api"

defineProps({
  value: {
    type: String,
    default: () => null,
  },
  label: {
    type: String,
    default: "Request Type",
  },
})

const emit = defineEmits(["input"])

const transportationTypes = Object.values(TRANSPORTATION_TYPES)
</script>
