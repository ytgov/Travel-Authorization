import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskFlightSegmentsApi from "@/api/travel-desk-flight-segments-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-desk-flight-segments-api.js').TravelDeskFlightSegment} TravelDeskFlightSegment */
/** @typedef {import('@/api/travel-desk-flight-segments-api.js').TravelDeskFlightSegmentsQueryOptions} TravelDeskFlightSegmentsQueryOptions */

/**
 * Provides reactive state management for travelDeskFlightSegments with API integration.
 *
 * @param {TravelDeskFlightSegmentsQueryOptions} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travelDeskFlightSegments.
 * @param {Object} [{ skipWatchIf = () => false }={}] - Configuration to conditionally skip API calls.
 * @param {Function} [skipWatchIf] - Function that returns a boolean to determine if fetching should be skipped.
 * @returns {{
 *   travelDeskFlightSegments: Ref<TravelDeskFlightSegment[]>,
 *   totalCount: Ref<number>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskFlightSegment[]>,
 *   refresh: () => Promise<TravelDeskFlightSegment[]>
 * }}
 */
export function useTravelDeskFlightSegments(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelDeskFlightSegments: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskFlightSegments, totalCount } = await travelDeskFlightSegmentsApi.list(
        unref(options)
      )
      state.isErrored = false
      state.travelDeskFlightSegments = travelDeskFlightSegments
      state.totalCount = totalCount
      return travelDeskFlightSegments
    } catch (error) {
      console.error("Failed to fetch travel desk flight segments:", error)
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

export default useTravelDeskFlightSegments
