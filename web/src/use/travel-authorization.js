import { reactive, toRefs } from "vue"

import travelAuthorizationsApi from "@/api/travel-authorizations-api"

export function useTravelAuthorization() {
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

  async function fetch(travelAuthorizationId, params = {}) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.get(
        travelAuthorizationId,
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
        state.travelAuthorization.id,
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
  async function expenseClaim(travelAuthorizationId, attributes) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.expenseClaim(
        travelAuthorizationId,
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
    ...toRefs(state),
    fetch,
    save,
    expenseClaim,
  }
}

export default useTravelAuthorization
