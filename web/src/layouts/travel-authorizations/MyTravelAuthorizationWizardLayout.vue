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

            <router-view
              ref="currentStepComponent"
              @updated="refreshHeaderAndLocalState"
            ></router-view>

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
import { computed, nextTick, onMounted, ref, toRefs } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"
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
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const { travelAuthorizationId } = toRefs(props)
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
  markAsEditable,
} = useMyTravelRequestWizard(travelAuthorizationId)

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  await isReady()

  if (isNil(currentWizardStepName.value)) {
    const firstStep = steps.value[0]
    await save({
      wizardStepName: firstStep.id,
    })
  } else if (currentStep.value.to && currentStep.value.to.name !== route.name) {
    await router.push(currentStep.value.to)
  }

  await nextTick()
  if (currentStepComponent.value?.initialize) {
    currentStepComponent.value.initialize({
      markAsEditable,
    })
  }
})

const currentStepComponent = ref(null)

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
    text: currentStep.value.subtitle,
    to: currentStep.value.to,
  },
])
useBreadcrumbs(breadcrumbs)
</script>
