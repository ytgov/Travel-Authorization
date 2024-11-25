import { computed, nextTick, watch } from "vue"
import { useRouter } from "vue2-helpers/vue-router"
import { isNil } from "lodash"

import { TRAVEL_METHODS } from "@/api/travel-segments-api"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"

import useTravelAuthorization, {
  STATUSES as TRAVEL_AUTHORIZATION_STATUSES,
} from "@/use/use-travel-authorization"

export function useMyTravelRequestWizard(travelAuthorizationId) {
  const { travelAuthorization, isLoading, refresh, save } =
    useTravelAuthorization(travelAuthorizationId)

  const currentStepNumber = computed(() => travelAuthorization.value.stepNumber || 1)

  const isTravelingByAir = computed(() =>
    travelAuthorization.value.travelSegments.some((segment) => {
      return segment.modeOfTransport === TRAVEL_METHODS.AIRCRAFT
    })
  )
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

  const isWaitingForApproval = computed(() => {
    return (
      travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT ||
      travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED
    )
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
        title: "Details",
        subtitle: "Review submitted trip details",
        to: {
          name: "my-travel-requests/details/DetailsPage",
          params: { travelAuthorizationId: travelAuthorizationId.value },
        },
        backButtonText: "Revert to Draft",
        backButtonProps: {
          color: "warning",
        },
      },
      {
        title: "Estimate",
        subtitle: "Review submitted estimate",
        to: {
          name: "my-travel-requests/estimate/EstimatePage",
          params: { travelAuthorizationId: travelAuthorizationId.value },
        },
      },
      ...(isWaitingForApproval.value
        ? [
            {
              title: "Waiting for approval",
              subtitle: "Travel request is submitted to supervisor and waiting for approval.",
              to: {
                name: "my-travel-requests/AwaitingApprovalPage",
                params: { travelAuthorizationId: travelAuthorizationId.value },
              },
              continueButtonProps: {
                disabled: true,
              },
            },
          ]
        : []),
      ...(isTravelingByAir.value
        ? [
            {
              title: "Request: traveller details",
              subtitle: "Enter traveller details",
              to: {
                name: "my-travel-requests/request/RequestEditTravelDetailsPage",
                params: { travelAuthorizationId: travelAuthorizationId.value },
              },
            },
            {
              title: "Request: edit",
              subtitle: "Edit travel desk request",
              to: {
                name: "my-travel-requests/request/RequestEditPage",
                params: { travelAuthorizationId: travelAuthorizationId.value },
              },
            },
            {
              title: "Request",
              subtitle: "Review request details",
              to: {
                name: "my-travel-requests/request/RequestPage",
                params: { travelAuthorizationId: travelAuthorizationId.value },
              },
            },
            {
              title: "Request: rank options",
              subtitle: "Rank flight options",
              to: {
                name: "my-travel-requests/request/RequestOptionsProvidedPage",
                params: { travelAuthorizationId: travelAuthorizationId.value },
              },
              disabled:
                travelAuthorization.value?.travelDeskTravelRequest?.status !==
                TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.OPTIONS_PROVIDED,
            },
          ]
        : []),
      expenseStep.value,
    ].map((step, index) => ({
      ...step,
      number: index + 1,
    }))
  )

  const currentStep = computed(() => {
    const currentStep = steps.value[currentStepNumber.value - 1]
    if (isNil(currentStep)) {
      return {
        continueButtonText: "Continue",
      }
    }

    return currentStep
  })

  const previousStep = computed(() => {
    const previousStepIndex = currentStepNumber.value - 2
    if (previousStepIndex < 0) {
      return {
        to: {
          name: "my-travel-requests/MyTravelRequestsPage",
        },
      }
    }

    const previousStep = steps.value[previousStepIndex]
    if (isNil(previousStep)) {
      return {
        to: {
          name: "my-travel-requests/MyTravelRequestsPage",
        },
      }
    }

    return previousStep
  })

  const nextStep = computed(() => {
    const nextStep = steps.value[currentStepNumber.value]
    if (isNil(nextStep)) {
      return {
        to: {
          name: "my-travel-requests/MyTravelRequestsPage",
        },
      }
    }

    return nextStep
  })

  const router = useRouter()

  async function goToPreviousStep() {
    const previousStepTo = previousStep.value.to
    await save({
      stepNumber: currentStepNumber.value - 1,
    })
    return router.push(previousStepTo)
  }

  async function goToNextStep() {
    const nextStepTo = nextStep.value.to
    await save({
      stepNumber: currentStepNumber.value + 1,
    })
    return router.push(nextStepTo)
  }

  async function goToStep(stepNumber) {
    const step = steps.value.find((step) => step.number === stepNumber)
    if (isNil(step) || isNil(step.to) || step.number === currentStepNumber.value) {
      return
    }

    await save({
      stepNumber,
    })
    return router.push(step.to)
  }

  async function isReady() {
    return new Promise((resolve) => {
      if (isLoading.value === false) {
        return resolve(true)
      }

      const stopWatch = watch(
        isLoading,
        async (newIsLoading) => {
          if (newIsLoading === false) {
            await nextTick()
            stopWatch()
            resolve(true)
          }
        },
        { immediate: true }
      )
    })
  }

  return {
    steps,
    currentStepNumber,
    currentStep,
    previousStep,
    nextStep,
    isLoading,
    isReady,
    save,
    refresh,
    goToStep,
    goToPreviousStep,
    goToNextStep,
  }
}

export default useMyTravelRequestWizard
