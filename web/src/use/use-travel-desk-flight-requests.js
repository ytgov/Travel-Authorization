import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskFlightRequestsApi from "@/api/travel-desk-flight-requests-api"

/**
 * TODO: add other fields
 * @typedef {Object} TravelDeskFlightRequest
 * @property {number} id
 */

/**
 * Provides reactive state management for travelDeskFlightRequests with API integration.
 *
 * @param {import('vue').Ref<{
 *   where?: { [key: string]: any },
 *   page?: number,
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travelDeskFlightRequests.
 * @param {Object} [{ skipWatchIf = () => false }={}] - Configuration to conditionally skip API calls.
 * @param {Function} [skipWatchIf] - Function that returns a boolean to determine if fetching should be skipped.
 * @returns {{
 *   travelDeskFlightRequests: import('vue').Ref<TravelDeskFlightRequest[]>,
 *   totalCount: import('vue').Ref<number>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<TravelDeskFlightRequest[]>,
 *   refresh: () => Promise<TravelDeskFlightRequest[]>
 * }}
 */
export function useTravelDeskFlightRequests(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelDeskFlightRequests: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskFlightRequests, totalCount } = await travelDeskFlightRequestsApi.list(
        unref(options)
      )
      state.isErrored = false
      state.travelDeskFlightRequests = travelDeskFlightRequests
      state.totalCount = totalCount
      return travelDeskFlightRequests
    } catch (error) {
      console.error("Failed to fetch travelDeskFlightRequests:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(options),
    async () => {
      if (skipWatchIf()) return

      await fetch()
    },
    { deep: true, immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useTravelDeskFlightRequests
