import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskTravelRequestsApi, {
  TRAVEL_DESK_TRAVEL_REQUEST_STATUSES,
} from "@/api/travel-desk-travel-requests-api"

export { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES }

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-desk-travel-requests-api.js').TravelDeskTravelRequestIndexView} TravelDeskTravelRequestIndexView */
/** @typedef {import('@/api/travel-desk-travel-requests-api.js').TravelDeskTravelRequestWhereOptions} TravelDeskTravelRequestWhereOptions */
/** @typedef {import('@/api/travel-desk-travel-requests-api.js').TravelDeskTravelRequestFiltersOptions} TravelDeskTravelRequestFiltersOptions */

/**
 * Provides reactive state management for travel allowances with API integration.
 *
 * @callback UseTravelDeskTravelRequests
 * @param {Ref<{
 *   where?: TravelDeskTravelRequestWhereOptions;
 *   filters?: TravelDeskTravelRequestFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travel allowances.
 * @param {{
 *  skipWatchIf?: () => boolean;
 * }} [config={ skipWatchIf = () => false } = {}] - Configuration to conditionally skip API calls.
 * @returns {{
 *   travelDeskTravelRequests: Ref<TravelDeskTravelRequestIndexView[]>,
 *   totalCount: Ref<number>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskTravelRequestIndexView[]>,
 *   refresh: () => Promise<TravelDeskTravelRequestIndexView[]>
 * }}
 */

/** @type {UseTravelDeskTravelRequests} */
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
