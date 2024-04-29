import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskHotelsApi, { TRAVEL_DESK_HOTEL_STATUSES } from "@/api/travel-desk-hotels-api"

export { TRAVEL_DESK_HOTEL_STATUSES }

/**
 * TODO: add other fields
 * @typedef {Object} TravelDeskHotel
 * @property {number} id
 */

/**
 * Provides reactive state management for travelDeskHotels with API integration.
 *
 * @param {import('vue').Ref<{
 *   where?: { [key: string]: any },
 *   page?: number,
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travelDeskHotels.
 * @param {Object} [{ skipWatchIf = () => false }={}] - Configuration to conditionally skip API calls.
 * @param {Function} [skipWatchIf] - Function that returns a boolean to determine if fetching should be skipped.
 * @returns {{
 *   travelDeskHotels: import('vue').Ref<TravelDeskHotel[]>,
 *   totalCount: import('vue').Ref<number>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<TravelDeskHotel[]>,
 *   refresh: () => Promise<TravelDeskHotel[]>
 * }}
 */
export function useTravelDeskHotels(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelDeskHotels: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskHotels, totalCount } = await travelDeskHotelsApi.list(unref(options))
      state.isErrored = false
      state.travelDeskHotels = travelDeskHotels
      state.totalCount = totalCount
      return travelDeskHotels
    } catch (error) {
      console.error("Failed to fetch travelDeskHotels:", error)
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

export default useTravelDeskHotels
