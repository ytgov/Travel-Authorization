<template>
  <v-select
    :value="value"
    :items="flightPreferenceOrders"
    :label="label"
    :hint="hint"
    persistent-hint
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  />
</template>

<script setup>
import { computed } from "vue"
import { times } from "lodash"

const props = defineProps({
  value: {
    type: Number,
    default: () => null,
  },
  label: {
    type: String,
    default: "Flight Preference Order",
  },
})

const emit = defineEmits(["input"])

const DOES_NOT_WORK = 0

const flightPreferenceOrders = computed(() => {
  return times(5, (i) => {
    if (i === DOES_NOT_WORK) {
      return {
        value: DOES_NOT_WORK,
        text: "Does Not Work",
      }
    }

    return {
      value: i,
      text: i,
    }
  })
})

const hint = computed(() => {
  if (props.value === DOES_NOT_WORK) {
    return "Please see the Additional Information."
  }

  return ""
})
</script>
