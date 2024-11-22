<template>
  <div class="d-flex flex-column flex-md-row">
    <TravelAuthorizationStateStepper
      :steps="steps"
      :current-step-number="currentStepNumber"
      @update:currentStepNumber="goToStep"
    />
    <div class="ml-2">
      <div class="d-flex justify-space-between align-baseline my-5">
        <h2 class="mb-0">
          Travel -
          <VUserChipMenu :user-id="currentUser.id" />
        </h2>
      </div>

      <v-card class="default">
        <v-card-text>
          <SummaryHeaderPanel
            :travel-authorization-id="travelAuthorizationIdAsNumber"
            class="mt-5"
          />

          <router-view
            ref="currentStepComponent"
            @updated="refresh"
          ></router-view>

          <div class="d-flex justify-end">
            <v-btn
              color="secondary"
              :to="previousStep.to"
              @click.prevent="goToPreviousStep"
              >Back</v-btn
            >
            <v-btn
              class="ml-3"
              :loading="isLoading"
              color="primary"
              :to="nextStep.to"
              @click.prevent="goToNextStep"
            >
              {{ currentStep.continueButtonText || "Continue" }}
            </v-btn>
          </div>

          <v-row class="mt-10">
            <v-col>
              <TravelAuthorizationActionLogsTable
                :travel-authorization-id="travelAuthorizationIdAsNumber"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from "vue"
import { useRoute } from "vue2-helpers/vue-router"
import { isNil } from "lodash"

import useCurrentUser from "@/use/use-current-user"

import VUserChipMenu from "@/components/VUserChipMenu.vue"
import TravelAuthorizationStateStepper from "@/components/travel-authorizations/TravelAuthorizationStateStepper.vue"
import SummaryHeaderPanel from "@/components/travel-authorizations/SummaryHeaderPanel.vue"
import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable.vue"
import useMyTravelRequestWizard from "@/use/wizards/use-my-travel-authorization-wizard"

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

const { currentUser } = useCurrentUser()

const { travelAuthorizationId } = toRefs(props)
const { currentStepNumber, steps, currentStep, nextStep, previousStep, goToStep, refresh } =
  useMyTravelRequestWizard(travelAuthorizationId)

const route = useRoute()

onMounted(() => {
  const step = steps.value.find((step) => step.to?.name === route.name)
  if (isNil(step)) {
    currentStepNumber.value = 1
  } else {
    currentStepNumber.value = step.number
  }
})

const isLoading = ref(false)

const currentStepComponent = ref(null)

async function goToNextStep() {
  isLoading.value = true
  try {
    const stepSuccess = await currentStepComponent.value?.continue()
    if (stepSuccess !== true) {
      return
    }
    currentStepNumber.value += 1
  } finally {
    isLoading.value = false
  }
}

async function goToPreviousStep() {
  isLoading.value = true
  try {
    currentStepNumber.value -= 1
  } finally {
    isLoading.value = false
  }
}
</script>
