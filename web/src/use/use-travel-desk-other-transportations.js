import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskOtherTransportationsApi, {
  TRAVEL_DESK_OTHER_TRANSPORTATION_STATUSES,
  TRANSPORTATION_TYPES,
} from "@/api/travel-desk-other-transportations-api"

export { TRAVEL_DESK_OTHER_TRANSPORTATION_STATUSES, TRANSPORTATION_TYPES }

/**
 * TODO: add other fields
 * @typedef {Object} TravelDeskOtherTransportation
 * @property {number} id
 */

/**
 * Provides reactive state management for travelDeskOtherTransportations with API integration.
 *
 * @param {import('vue').Ref<{
 *   where?: { [key: string]: any },
 *   page?: number,
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travelDeskOtherTransportations.
 * @param {Object} [{ skipWatchIf = () => false }={}] - Configuration to conditionally skip API calls.
 * @param {Function} [skipWatchIf] - Function that returns a boolean to determine if fetching should be skipped.
 * @returns {{
 *   travelDeskOtherTransportations: import('vue').Ref<TravelDeskOtherTransportation[]>,
 *   totalCount: import('vue').Ref<number>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<TravelDeskOtherTransportation[]>,
 *   refresh: () => Promise<TravelDeskOtherTransportation[]>
 * }}
 */
export function useTravelDeskOtherTransportations(
  options = ref({}),
  { skipWatchIf = () => false } = {}
) {
  const state = reactive({
    travelDeskOtherTransportations: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskOtherTransportations, totalCount } =
        await travelDeskOtherTransportationsApi.list(unref(options))
      state.isErrored = false
      state.travelDeskOtherTransportations = travelDeskOtherTransportations
      state.totalCount = totalCount
      return travelDeskOtherTransportations
    } catch (error) {
      console.error("Failed to fetch travelDeskOtherTransportations:", error)
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

export default useTravelDeskOtherTransportations
