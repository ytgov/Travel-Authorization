<template>
  <v-select
    :value="value"
    :items="seatPreferences"
    :label="label"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  />
  <!-- <v-text-field
    label="Preference"
    :value="flightPreferenceOrderText"
    :hint="
      flightOption.flightPreferenceOrder === DOES_NOT_WORK
        ? 'Please see the Additional Information.'
        : ''
    "
    persistent-hint
    outlined
    readonly
  /> -->
</template>

<script setup>
import { SEAT_PREFERENCE_TYPES } from "@/api/travel-desk-flight-requests-api"

defineProps({
  value: {
    type: String,
    default: () => null,
  },
  label: {
    type: String,
    default: "Flight Preference Order",
  },
})

const emit = defineEmits(["input"])

// const DOES_NOT_WORK = 0

// const flightPreferenceOrderText = computed(() => {
//   return props.flightOption.flightPreferenceOrder === DOES_NOT_WORK
//     ? "Does Not Work"
//     : props.flightOption.flightPreferenceOrder
// })

const seatPreferences = Object.values(SEAT_PREFERENCE_TYPES)
</script>
