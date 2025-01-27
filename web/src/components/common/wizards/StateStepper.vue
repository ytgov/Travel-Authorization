<template>
  <v-stepper
    :key="stepsHash"
    :value="currentStepNumber"
    vertical
    outlined
    :width="$vuetify.breakpoint.mdAndUp ? 250 : undefined"
  >
    <v-stepper-step
      v-for="(step, index) in steps"
      :key="index"
      :step="step.number"
      :complete="step.number < currentStepNumber"
      :editable="step.disabled !== true && step.number <= currentStepNumber"
      @click="
        updateCurrentStepNumber(
          step.number,
          step.disabled !== true && step.number <= currentStepNumber
        )
      "
    >
      {{ step.title }}
      <small v-if="step.subtitle">
        {{ step.subtitle }}
      </small>
    </v-stepper-step>
  </v-stepper>
</template>

<script setup>
import { computed } from "vue"
import md5 from "md5"

const props = defineProps({
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

const stepsHash = computed(() => md5(JSON.stringify(props.steps)))

function updateCurrentStepNumber(stepNumber, editable) {
  if (editable) {
    emit("update:currentStepNumber", stepNumber)
  }
}
</script>
