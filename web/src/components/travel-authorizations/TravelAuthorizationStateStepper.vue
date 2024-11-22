<template>
  <!-- TODO: consider if this should be a v-navigation-drawer + v-list instead? -->
  <v-skeleton-loader
    v-if="isNil(travelAuthorization.id)"
    type="list-item@4"
    :width="$vuetify.breakpoint.mdAndUp ? 300 : undefined"
  />
  <v-stepper
    v-else
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
      @click="goToStep(step)"
    >
      {{ step.title }}
      <small v-if="step.subtitle">
        {{ step.subtitle }}
      </small>
    </v-stepper-step>
  </v-stepper>
</template>

<script setup>
import { toRefs, computed } from "vue"
import { useRoute } from "vue2-helpers/vue-router"
import { isNil } from "lodash"

import { TRAVEL_METHODS } from "@/api/travel-segments-api"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"
import useTravelAuthorization, {
  STATUSES as TRAVEL_AUTHORIZATION_STATUSES,
} from "@/use/use-travel-authorization"
import router from "@/router"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const {
  travelAuthorization,
  refresh: refreshTravelAuthorization,
  save,
} = useTravelAuthorization(travelAuthorizationId)

const requestStep = computed(() => {
  // TODO: lock on denied states.
  const isWaitingForApproval =
    travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT ||
    travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED
  const hasNoAirTravel = travelAuthorization.value.travelSegments.every(
    (segment) => segment.modeOfTransport !== TRAVEL_METHODS.AIRCRAFT
  )
  const isLocked = isWaitingForApproval || hasNoAirTravel

  const lockReasons = []
  if (isWaitingForApproval) {
    lockReasons.push("Travel authorization is waiting for approval.")
  }

  if (hasNoAirTravel) {
    lockReasons.push("Disabled as traveler is not traveling by air.")
  }

  if (isLocked === true) {
    return {
      title: "Request",
      subtitle: lockReasons.join(" "),
      complete: false,
    }
  }

  if (
    travelAuthorization.value?.travelDeskTravelRequest?.status ===
    TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.DRAFT
  ) {
    return {
      title: "Request",
      subtitle: "Edit request",
      to: {
        name: "my-travel-requests/request/RequestEditPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    }
  }

  return {
    title: "Request",
    subtitle: "Review request details",
    to: {
      name: "my-travel-requests/request/RequestPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  }
})

const optionsProvideStep = computed(() => {
  if (
    travelAuthorization.value?.travelDeskTravelRequest?.status ===
    TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.OPTIONS_PROVIDED
  ) {
    return {
      title: "Request: Rank Options",
      subtitle: "Rank flight options",
      to: {
        name: "my-travel-requests/request/RequestOptionsProvidedPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    }
  }

  return {
    title: "Request: Rank Options",
    subtitle: "Requires completing request section.",
  }
})

const isBeforeTravelStartDate = computed(() => {
  const firstTravelSegment = travelAuthorization.value.travelSegments[0]
  if (isNil(firstTravelSegment)) return false

  return new Date(firstTravelSegment.departureOn) > new Date()
})
const expenseStep = computed(() => {
  const isInPreExpensingStates =
    travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT ||
    travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED
  const isAfterTravelStartDate = !isBeforeTravelStartDate.value
  const isLocked = isInPreExpensingStates || isBeforeTravelStartDate.value
  const isEditable =
    travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.APPROVED &&
    isAfterTravelStartDate

  const lockReasons = []
  if (isInPreExpensingStates) {
    lockReasons.push("Travel authorization is in pre-expensing states (not approved).")
  }

  if (isBeforeTravelStartDate.value) {
    lockReasons.push("Travel has not started yet.")
  }

  if (isLocked === true) {
    return {
      title: "Expense",
      subtitle: lockReasons.join(" "),
    }
  }

  if (isEditable) {
    return {
      title: "Expense",
      subtitle: "Submit expenses",
      to: {
        name: "my-travel-requests/expense/ExpenseEditPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    }
  }

  return {
    title: "Expense",
    subtitle: "Review submitted expense",
    to: {
      name: "my-travel-requests/expense/ExpensePage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  }
})

const steps = computed(() =>
  [
    {
      title: "Details: purpose",
      subtitle: "Enter trip purpose",
      to: {
        name: "my-travel-requests/details/DetailsEditPurposePage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
      disabled: travelAuthorization.value?.status !== TRAVEL_AUTHORIZATION_STATUSES.DRAFT,
    },
    {
      title: "Details: trip",
      subtitle: "Enter trip details",
      to: {
        name: "my-travel-requests/details/DetailsEditTripPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
      disabled: travelAuthorization.value?.status !== TRAVEL_AUTHORIZATION_STATUSES.DRAFT,
    },
    {
      title: "Estimate: edit",
      subtitle: "Generate estimate",
      to: {
        name: "my-travel-requests/estimate/EstimateEditPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
      disabled: travelAuthorization.value.status !== TRAVEL_AUTHORIZATION_STATUSES.DRAFT,
    },
    {
      title: "Details: submit",
      subtitle: "Submit travel request",
      to: {
        name: "my-travel-requests/details/DetailsSubmitPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
      continueButtonText: "Submit to Supervisor",
      disabled: travelAuthorization.value?.status !== TRAVEL_AUTHORIZATION_STATUSES.DRAFT,
    },
    {
      title: "Estimate",
      subtitle: "Review submitted estimate",
      to: {
        name: "my-travel-requests/estimate/EstimatePage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    },
    {
      title: "Details",
      subtitle: "Review submitted trip details",
      to: {
        name: "my-travel-requests/details/DetailsPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    },
    requestStep.value,
    optionsProvideStep.value,
    expenseStep.value,
  ].map((step, index) => ({
    ...step,
    number: index + 1,
  }))
)

const route = useRoute()

const currentStepNumber = computed(() => {
  const step = steps.value.find((step) => step.to?.name === route.name)
  if (isNil(step)) {
    return 1
  }

  return step.number
})

const currentStepContinueButtonText = computed(() => {
  const currentStep = steps.value[currentStepNumber.value - 1]
  if (isNil(currentStep)) {
    return null
  }

  return currentStep.continueButtonText
})

const previousStepTo = computed(() => {
  const previousStepIndex = currentStepNumber.value - 2
  if (previousStepIndex < 0) {
    return {
      name: "my-travel-requests/MyTravelRequestsPage",
    }
  }

  const previousStep = steps.value[previousStepIndex]
  if (isNil(previousStep)) {
    return {
      name: "my-travel-requests/MyTravelRequestsPage",
    }
  }

  return previousStep.to
})

const nextStepTo = computed(() => {
  const nextStep = steps.value[currentStepNumber.value]
  if (isNil(nextStep)) {
    return {
      name: "my-travel-requests/MyTravelRequestsPage",
    }
  }

  return nextStep.to
})

async function goToStep(step) {
  if (isNil(step.to) || step.disabled === true || step.number > currentStepNumber.value) {
    return
  }

  await save({
    stepNumber: step.number,
  })

  return router.push(step.to)
}

async function refresh() {
  await refreshTravelAuthorization()
}

defineExpose({
  refresh,
  currentStepContinueButtonText,
  previousStepTo,
  nextStepTo,
})
</script>
