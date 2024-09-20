import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskTravelAgenciesApi from "@/api/travel-desk-travel-agencies-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-desk-travel-agencies-api.js').TravelDeskTravelAgency} TravelDeskTravelAgency */
/** @typedef {import('@/api/travel-desk-travel-agencies-api.js').TravelDeskTravelAgencyWhereOptions} TravelDeskTravelAgencyWhereOptions */
/** @typedef {import('@/api/travel-desk-travel-agencies-api.js').TravelDeskTravelAgencyFiltersOptions} TravelDeskTravelAgencyFiltersOptions */

/**
 * Provides reactive state management for travel allowances with API integration.
 *
 * @callback UseTravelDeskTravelAgencies
 * @param {Ref<{
 *   where?: TravelDeskTravelAgencyWhereOptions;
 *   filters?: TravelDeskTravelAgencyFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travel allowances.
 * @param {{
 *  skipWatchIf?: () => boolean;
 * }} [config={ skipWatchIf = () => false } = {}] - Configuration to conditionally skip API calls.
 * @returns {{
 *   travelDeskTravelAgencies: Ref<TravelDeskTravelAgency[]>,
 *   totalCount: Ref<number>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskTravelAgency[]>,
 *   refresh: () => Promise<TravelDeskTravelAgency[]>
 * }}
 */

/** @type {UseTravelDeskTravelAgencies} */
export function useTravelDeskTravelAgencies(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelDeskTravelAgencies: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  /** @returns {Promise<TravelDeskTravelAgency[]>} */
  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskTravelAgencies, totalCount } = await travelDeskTravelAgenciesApi.list(
        unref(options)
      )
      state.isErrored = false
      state.travelDeskTravelAgencies = travelDeskTravelAgencies
      state.totalCount = totalCount
      return travelDeskTravelAgencies
    } catch (error) {
      console.error("Failed to fetch travel desk travel agencies:", error)
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

export default useTravelDeskTravelAgencies
