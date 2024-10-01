import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskTravelRequestsApi, {
  TRAVEL_DESK_TRAVEL_REQUEST_STATUSES,
} from "@/api/travel-desk-travel-requests-api"

export { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES }

/**
 * TODO: add other fields
 * @typedef {Object} TravelDeskTravelRequest
 * @property {number} id
 */

/**
 * Provides reactive state management for travelDeskTravelRequests with API integration.
 *
 * @param {import('vue').Ref<{
 *   where?: { [key: string]: any },
 *   page?: number,
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travelDeskTravelRequests.
 * @param {Object} [{ skipWatchIf = () => false }={}] - Configuration to conditionally skip API calls.
 * @param {Function} [skipWatchIf] - Function that returns a boolean to determine if fetching should be skipped.
 * @returns {{
 *   travelDeskTravelRequests: import('vue').Ref<TravelDeskTravelRequest[]>,
 *   totalCount: import('vue').Ref<number>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<TravelDeskTravelRequest[]>,
 *   refresh: () => Promise<TravelDeskTravelRequest[]>
 * }}
 */
export function useTravelDeskTravelRequests(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelDeskTravelRequests: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskTravelRequests, totalCount } = await travelDeskTravelRequestsApi.list(
        unref(options)
      )
      state.isErrored = false
      state.travelDeskTravelRequests = travelDeskTravelRequests
      state.totalCount = totalCount
      return travelDeskTravelRequests
    } catch (error) {
      console.error("Failed to fetch travelDeskTravelRequests:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => [skipWatchIf(), unref(options)],
    async ([skip]) => {
      if (skip) return

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

export default useTravelDeskTravelRequests
