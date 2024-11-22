<template>
  <v-stepper
    :value="currentStepNumber"
    vertical
    outlined
    :width="$vuetify.breakpoint.mdAndUp ? 300 : undefined"
  >
    <v-stepper-step
      v-for="step in steps"
      :key="`${step.title}-${step.number}`"
      :step="step.number"
      :complete="step.number < currentStepNumber"
      :editable="step.disabled !== true && step.number <= currentStepNumber"
      @click="emit('update:currentStepNumber', step.number)"
    >
      {{ step.title }}
      <small v-if="step.subtitle">
        {{ step.subtitle }}
      </small>
    </v-stepper-step>
  </v-stepper>
</template>

<script setup>
defineProps({
  currentStepNumber: {
    type: Number,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(["update:currentStepNumber"])
</script>
