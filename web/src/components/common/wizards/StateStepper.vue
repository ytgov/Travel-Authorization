<template>
  <v-stepper
    :value="currentStepNumber"
    vertical
    outlined
    :width="$vuetify.breakpoint.mdAndUp ? 300 : undefined"
  >
    <v-stepper-step
      v-for="(step, index) in steps"
      :key="index"
      :step="step.number"
      :complete="step.number < currentStepNumber"
      :editable="step.disabled !== true && step.number <= currentStepNumber"
      @click="updateCurrentStepNumber(step.number, step.disabled)"
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

function updateCurrentStepNumber(stepNumber, disabled) {
  if (disabled) return

  emit("update:currentStepNumber", stepNumber)
}
</script>
