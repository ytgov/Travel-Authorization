import { computed, nextTick, reactive, toRefs, watch } from "vue"
import { useRouter } from "vue2-helpers/vue-router"
import { isNil } from "lodash"

import useTravelAuthorization from "@/use/use-travel-authorization"

import buildMyTravelRequestSteps from "@/use/wizards/build-my-travel-request-steps"

const state = reactive({
  travelAuthorizationId: null,
  steps: [],
  isLoading: false,
  isErrored: false,
})

export function useMyTravelRequestWizard(travelAuthorizationId) {
  state.steps = buildMyTravelRequestSteps(travelAuthorizationId)

  const { travelAuthorization, isLoading, refresh, save } =
    useTravelAuthorization(travelAuthorizationId)

  const currentWizardStepName = computed(() => travelAuthorization.value.wizardStepName || null)

  const currentStep = computed(() => {
    const currentStep = state.steps.find((step) => step.id === currentWizardStepName.value)
    if (isNil(currentStep)) {
      return {
        continueButtonText: "Continue",
      }
    }

    return currentStep
  })

  const currentStepIndex = computed(() =>
    state.steps.findIndex((step) => step.id === currentWizardStepName.value)
  )

  const previousStep = computed(() => {
    const previousStepIndex = currentStepIndex.value - 1
    if (previousStepIndex < 0) return null

    const previousStep = state.steps[previousStepIndex]
    if (isNil(previousStep)) return null

    return previousStep
  })

  const nextStep = computed(() => {
    const nextStep = state.steps[currentStepIndex.value + 1]
    if (isNil(nextStep)) return null

    return nextStep
  })

  const router = useRouter()

  async function goToPreviousStep() {
    if (isNil(previousStep.value)) {
      return router.push({
        name: "my-travel-requests/MyTravelRequestsPage",
      })
    }

    const previousStepName = previousStep.value.id
    await save({
      wizardStepName: previousStepName,
    })
    return router.push({
      name: "my-travel-requests/MyTravelRequestWizardPage",
      params: {
        travelAuthorizationId: travelAuthorizationId.value,
        stepName: previousStepName,
      },
    })
  }

  async function goToNextStep() {
    if (isNil(nextStep.value)) {
      return router.push({
        name: "my-travel-requests/MyTravelRequestsPage",
      })
    }

    const nextStepName = nextStep.value.id
    await save({
      wizardStepName: nextStepName,
    })
    return router.push({
      name: "my-travel-requests/MyTravelRequestWizardPage",
      params: {
        travelAuthorizationId: travelAuthorizationId.value,
        stepName: nextStepName,
      },
    })
  }

  async function goToStep(stepName) {
    if (stepName === currentWizardStepName.value) return

    const step = state.steps.find((step) => step.id === stepName)
    if (isNil(step)) return

    await save({
      wizardStepName: stepName,
    })
    return router.push({
      name: "my-travel-requests/MyTravelRequestWizardPage",
      params: {
        travelAuthorizationId: travelAuthorizationId.value,
        stepName,
      },
    })
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

  function setEditableSteps(stepIds) {
    state.steps.forEach((step) => {
      if (stepIds.includes(step.id)) {
        step.editable = true
      } else {
        step.editable = false
      }
    })
  }

  return {
    ...toRefs(state),
    currentWizardStepName,
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
    setEditableSteps,
  }
}

export default useMyTravelRequestWizard
