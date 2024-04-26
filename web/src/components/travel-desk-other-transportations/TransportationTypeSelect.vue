<template>
  <v-select
    :value="value"
    label="Request Type"
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
})

const emit = defineEmits(["input"])

const transportationTypes = Object.values(TRANSPORTATION_TYPES)
</script>
