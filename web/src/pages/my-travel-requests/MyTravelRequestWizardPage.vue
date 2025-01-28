<template>
  <div>
    <div class="d-flex flex-column flex-md-row">
      <StateStepper
        class="flex-shrink-0"
        :steps="steps"
        :current-wizard-step-name="currentWizardStepName"
        @update:currentWizardStepName="goToStep"
      />
      <div class="ml-md-2 flex-grow-1">
        <v-card class="default">
          <v-card-text>
            <SummaryHeaderPanel
              ref="summaryHeaderPanel"
              :travel-authorization-id="travelAuthorizationIdAsNumber"
              class="mb-5"
            />

            <v-skeleton-loader
              v-if="isNil(currentStep.component)"
              type="card"
            />
            <component
              :is="currentStep.component"
              v-else
              ref="currentStepComponent"
              :travel-authorization-id="travelAuthorizationIdAsNumber"
              @updated="refreshHeaderAndLocalState"
            />

            <div class="d-flex flex-column flex-md-row justify-md-end">
              <v-btn
                v-bind="{
                  color: 'secondary',
                  ...currentStep.backButtonProps,
                }"
                @click="backAndGoToPreviousStep"
              >
                {{ currentStep.backButtonText || "Back" }}
              </v-btn>
              <v-btn
                class="ml-0 ml-md-3"
                v-bind="{
                  color: 'primary',
                  ...currentStep.continueButtonProps,
                  loading: isLoading,
                }"
                @click="continueAndGoToNextStep"
              >
                {{ currentStep.continueButtonText || "Continue" }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-row class="mt-md-10 mt-5">
      <v-col>
        <TravelAuthorizationActionLogsTable
          :travel-authorization-id="travelAuthorizationIdAsNumber"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useMyTravelRequestWizard from "@/use/wizards/use-my-travel-request-wizard"

import StateStepper from "@/components/common/wizards/StateStepper.vue"
import SummaryHeaderPanel from "@/components/travel-authorizations/SummaryHeaderPanel.vue"
import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable.vue"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
  stepName: {
    type: String,
    default: null,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const {
  currentWizardStepName,
  steps,
  currentStep,
  isLoading,
  isReady,
  save,
  refresh,
  goToStep,
  goToNextStep,
  goToPreviousStep,
  setEditableSteps,
} = useMyTravelRequestWizard(travelAuthorizationIdAsNumber)

onMounted(async () => {
  await isReady()

  if (isNil(currentWizardStepName.value)) {
    const firstStep = steps.value[0]
    await save({
      wizardStepName: firstStep.id,
    })
  }
})

const currentStepComponent = ref(null)

watch(
  () => currentStepComponent.value,
  (newStepComponent) => {
    if (isNil(newStepComponent)) return

    if (newStepComponent.initialize) {
      newStepComponent.initialize({
        setEditableSteps,
      })
    }
  },
  {
    immediate: true,
  }
)

async function backAndGoToPreviousStep() {
  if (isNil(currentStepComponent.value?.back)) {
    return goToPreviousStep()
  }

  isLoading.value = true
  try {
    const stepSuccess = await currentStepComponent.value?.back()
    if (stepSuccess !== true) {
      return
    }
    return goToPreviousStep()
  } finally {
    isLoading.value = false
  }
}

async function continueAndGoToNextStep() {
  if (isNil(currentStepComponent.value?.continue)) {
    return goToNextStep()
  }

  isLoading.value = true
  try {
    const stepSuccess = await currentStepComponent.value?.continue()
    if (stepSuccess !== true) {
      return
    }
    return goToNextStep()
  } finally {
    isLoading.value = false
  }
}

/** @type {Ref<InstanceType<typeof SummaryHeaderPanel> | null>} */
const summaryHeaderPanel = ref(null)

async function refreshHeaderAndLocalState() {
  await Promise.all([summaryHeaderPanel.value?.refresh(), refresh()])
}

const breadcrumbs = computed(() => [
  {
    text: "My Travel Requests",
    to: {
      name: "my-travel-requests/MyTravelRequestsPage",
    },
  },
  {
    text: "Wizard",
    disabled: true,
  },
  isNil(currentStep.value?.id)
    ? {
        text: "loading ...",
        disabled: true,
      }
    : {
        text: currentStep.value.subtitle,
        to: {
          name: "my-travel-requests/MyTravelRequestWizardPage",
          params: {
            travelAuthorizationId: travelAuthorizationIdAsNumber.value,
            stepName: currentStep.value.id,
          },
        },
      },
])
useBreadcrumbs(breadcrumbs)
</script>
