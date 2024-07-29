import { reactive, toRefs, ref, unref, watch } from "vue"

import travelAllowancesApi, {
  TRAVEL_ALLOWANCE_ALLOWANCE_TYPES,
  TRAVEL_ALLOWANCE_CURRENCY_TYPES,
} from "@/api/travel-allowances-api"

export { TRAVEL_ALLOWANCE_ALLOWANCE_TYPES, TRAVEL_ALLOWANCE_CURRENCY_TYPES }

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-allowances-api.js').TravelAllowance} TravelAllowance */
/** @typedef {import('@/api/travel-allowances-api.js').TravelAllowanceWhereOptions} TravelAllowanceWhereOptions */
/** @typedef {import('@/api/travel-allowances-api.js').TravelAllowanceFiltersOptions} TravelAllowanceFiltersOptions */

/**
 * Provides reactive state management for travel allowances with API integration.
 *
 * @callback UseTravelAllowances
 * @param {Ref<{
 *   where?: TravelAllowanceWhereOptions;
 *   filters?: TravelAllowanceFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travel allowances.
 * @param {{
 *  skipWatchIf?: () => boolean;
 * }} [config={ skipWatchIf = () => false } = {}] - Configuration to conditionally skip API calls.
 * @returns {{
 *   travelAllowances: Ref<TravelAllowance[]>,
 *   totalCount: Ref<number>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelAllowance[]>,
 *   refresh: () => Promise<TravelAllowance[]>
 * }}
 */

/** @type {UseTravelAllowances} */
export function useTravelAllowances(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelAllowances: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  /** @returns {Promise<TravelAllowance[]>} */
  async function fetch() {
    state.isLoading = true
    try {
      const { travelAllowances, totalCount } = await travelAllowancesApi.list(unref(options))
      state.isErrored = false
      state.travelAllowances = travelAllowances
      state.totalCount = totalCount
      return travelAllowances
    } catch (error) {
      console.error("Failed to fetch travel allowances:", error)
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

export default useTravelAllowances
