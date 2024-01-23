import { computed, reactive, toRefs, unref, watch } from "vue"
import { isNumber } from "lodash"

import travelAuthorizationsApi, { STATUSES } from "@/api/travel-authorizations-api"

import { asGlobalUse } from "@/use/helper-utils"

const globalState = new Map()

/**
 * This stores a global travel authorization state per id.
 *
 * @param {import('vue').Ref<number>} travelAuthorizationId
 */
export function useGlobalTravelAuthorization(travelAuthorizationId) {
  const useGlobalUserFunction = asGlobalUse(globalState, useTravelAuthorization)
  return useGlobalUserFunction(travelAuthorizationId)
}

/**
 * This function retrieves and processes travel authorization data based on a given travel authorization ID.
 *
 * @param {import('vue').Ref<number>} travelAuthorizationId
 */
export function useTravelAuthorization(travelAuthorizationId) {
  const state = reactive({
    travelAuthorization: {
      expenses: [],
      purpose: {},
      stops: [],
      travelSegments: [],
      user: {},
    },
    isLoading: false,
    isErrored: false,
  })

  async function fetch(params = {}) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.get(
        unref(travelAuthorizationId),
        params
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to fetch travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save() {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.update(
        unref(travelAuthorizationId),
        state.travelAuthorization
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to update travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function create(attributes) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.create(attributes)
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to create travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // Stateful actions
  async function approve() {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.approve(
        unref(travelAuthorizationId)
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to approve for travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function deny({ denialReason } = {}) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.deny(
        unref(travelAuthorizationId),
        { denialReason }
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to deny for travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function expenseClaim(attributes) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.expenseClaim(
        unref(travelAuthorizationId),
        attributes
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to submit expense claim for travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(travelAuthorizationId),
    async (newTravelAuthorizationId) => {
      if (!isNumber(newTravelAuthorizationId)) return

      await fetch()
    },
    { immediate: true }
  )

  const stops = computed(() => state.travelAuthorization.stops)
  const firstStop = computed(() => stops.value[0] || {})
  const lastStop = computed(() => stops.value[stops.value.length - 1] || {})

  function newBlankStop(attributes) {
    return {
      travelAuthorizationId: state.travelAuthorization.id,
      ...attributes,
    }
  }

  // In the future it might make sense to directly update stops in the back-end
  function replaceStops(stops) {
    state.travelAuthorization = {
      ...state.travelAuthorization,
      stops,
    }

    return stops
  }

  return {
    STATUSES,
    ...toRefs(state),
    // computed attributes
    stops,
    firstStop,
    lastStop,
    // methods
    fetch,
    save,
    create,
    newBlankStop,
    replaceStops,
    // stateful action
    approve,
    deny,
    expenseClaim,
  }
}

export default useTravelAuthorization
