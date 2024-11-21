<template>
  <!-- TODO: consider if this should be a v-navigation-drawer + v-list instead? -->
  <v-skeleton-loader
    v-if="isNil(travelAuthorization.id)"
    type="list-item@4"
    min-width="300px"
  />
  <v-stepper
    v-else
    :value="currentStepNumber"
    vertical
    outlined
  >
    <template v-for="(step, index) in steps">
      <v-stepper-step
        v-if="isNil(step.to)"
        :key="index"
        :step="index + 1"
        :complete="step.complete"
      >
        {{ step.title }}
        <small v-if="step.subtitle">
          {{ step.subtitle }}
        </small>
      </v-stepper-step>
      <router-link
        v-else
        :key="index"
        :to="step.to"
        exact
      >
        <v-stepper-step
          :step="index + 1"
          :complete="step.complete"
        >
          {{ step.title }}
          <small v-if="step.subtitle">
            {{ step.subtitle }}
          </small>
        </v-stepper-step>
      </router-link>
    </template>
  </v-stepper>
</template>

<script setup>
import { toRefs, computed } from "vue"
import { isNil } from "lodash"

import { TRAVEL_METHODS } from "@/api/travel-segments-api"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"
import useExpenses, { TYPES as EXPENSE_TYPES } from "@/use/use-expenses"
import useTravelAuthorization, {
  STATUSES as TRAVEL_AUTHORIZATION_STATUSES,
} from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, refresh: refreshTravelAuthorization } =
  useTravelAuthorization(travelAuthorizationId)

const detailsSteps = computed(() => {
  if (travelAuthorization.value?.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT) {
    return [
      {
        title: "Details: purpose",
        subtitle: "Enter trip purpose",
        to: {
          name: "my-travel-requests/details/DetailsEditPurposePage",
          params: { travelAuthorizationId: travelAuthorizationId.value },
        },
        complete: travelAuthorization.value.stepNumber > 1,
      },
      {
        title: "Details",
        subtitle: "Edit trip details",
        to: {
          name: "my-travel-requests/details/DetailsEditPage",
          params: { travelAuthorizationId: travelAuthorizationId.value },
        },
        complete: travelAuthorization.value.stepNumber > 2,
      },
    ]
  }

  return [
    {
      title: "Details",
      subtitle: "Review submitted trip details",
      to: {
        name: "my-travel-requests/details/DetailsPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
      complete: true,
    },
  ]
})

const expenseOptions = computed(() => ({
  where: {
    travelAuthorizationId: props.travelAuthorizationId,
    type: EXPENSE_TYPES.ESTIMATE,
  },
}))
const { expenses: estimates, refresh: refreshEstimates } = useExpenses(expenseOptions)
const estimateStep = computed(() => {
  if (travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT) {
    return {
      title: "Estimate",
      subtitle: "Generate estimate",
      to: {
        name: "my-travel-requests/estimate/EstimateEditPage",
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
      complete: estimates.value.length > 0,
    }
  }

  return {
    title: "Estimate",
    subtitle: "Review submitted estimate",
    to: {
      name: "my-travel-requests/estimate/EstimatePage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
    complete: true,
  }
})

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
      complete: false,
    }
  }

  return {
    title: "Request",
    subtitle: "Review request details",
    to: {
      name: "my-travel-requests/request/RequestPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
    complete: true,
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
      complete: false,
    }
  }

  return {
    title: "Request: Rank Options",
    subtitle: "Requires completing request section.",
    complete: false,
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
      complete: false,
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
      complete: false,
    }
  }

  return {
    title: "Expense",
    subtitle: "Review submitted expense",
    to: {
      name: "my-travel-requests/expense/ExpensePage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
    complete: true,
  }
})

const steps = computed(() => [
  ...detailsSteps.value,
  estimateStep.value,
  requestStep.value,
  optionsProvideStep.value,
  expenseStep.value,
])

const currentStepNumber = computed(() => {
  const index = steps.value.findIndex((step) => step.complete === false)
  if (index === -1) {
    return 1
  }

  return index + 1
})

async function refresh() {
  await refreshTravelAuthorization()
  await refreshEstimates()
}

defineExpose({
  refresh,
})
</script>
