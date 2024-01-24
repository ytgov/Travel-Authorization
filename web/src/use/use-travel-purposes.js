import { reactive, toRefs } from "vue"

import travelPurposesApi from "@/api/travel-purposes-api"

import { sleep } from "@/utils/sleep"

export function useTravelPurposes() {
  const state = reactive({
    travelPurposes: [],
    isLoading: false,
    isErrored: false,
    isCached: false,
  })

  async function ensure() {
    while (state.isLoading) {
      await sleep(75)
    }

    if (state.isErrored) {
      console.error("Travel purposes store has errored, returning [].")
      return []
    }

    if (state.isCached) {
      return state.items
    }

    state.isCached = false
    return fetch()
  }

  async function fetch() {
    state.isLoading = true
    try {
      const { travelPurposes } = await travelPurposesApi.list()
      state.isErrored = false
      state.travelPurposes = travelPurposes
      return travelPurposes
    } catch (error) {
      console.error("Failed to fetch travel authorizations:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  ensure() // Normally would go inside a "watch" but this doesn't have any params to watch yet

  return {
    ...toRefs(state),
    fetch,
  }
}

export default useTravelPurposes
