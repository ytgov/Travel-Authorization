<template>
  <v-select
    :value="value"
    :items="seatPreferences"
    label="Seat Preference"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  />
</template>

<script setup>
import { SEAT_PREFERENCE_TYPES } from "@/api/travel-desk-flight-requests-api"

defineProps({
  value: {
    type: String,
    default: () => null,
  },
})

const emit = defineEmits(["input"])

const seatPreferences = Object.values(SEAT_PREFERENCE_TYPES)
</script>
