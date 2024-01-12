import { reactive, toRefs, unref } from "vue"

import travelAuthorizationsApi, { STATUSES } from "@/api/travel-authorizations-api"

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

  // Stateful actions
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

  return {
    STATUSES,
    ...toRefs(state),
    fetch,
    save,
    expenseClaim,
  }
}

export default useTravelAuthorization
