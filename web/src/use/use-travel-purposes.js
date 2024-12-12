import { reactive, ref, toRefs, unref, watch } from "vue"

import travelPurposesApi from "@/api/travel-purposes-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-purposes-api.js').TravelPurpose} TravelPurpose */
/** @typedef {import('@/api/travel-purposes-api.js').TravelPurposeWhereOptions} TravelPurposeWhereOptions */
/** @typedef {import('@/api/travel-purposes-api.js').TravelPurposeFiltersOptions} TravelPurposeFiltersOptions */

/**
 * @callback UseTravelPurposes
 * @param {Ref<{
 *   where?: TravelPurposeWhereOptions;
 *   filters?: TravelPurposeFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travel purposes.
 * @param {{
 *  skipWatchIf?: () => boolean;
 * }} [config={ skipWatchIf = () => false } = {}] - Configuration to conditionally skip API calls.
 * @returns {{
 *   travelPurposes: Ref<TravelPurpose[]>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelPurpose[]>,
 *   refresh: () => Promise<TravelPurpose[]>,
 * }}
 */

/** @type {UseTravelPurposes} */
export function useTravelPurposes(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelPurposes: [],
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelPurposes } = await travelPurposesApi.list(unref(options))
      state.isErrored = false
      state.travelPurposes = travelPurposes
      return travelPurposes
    } catch (error) {
      console.error("Failed to fetch travel purposes:", error)
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

export default useTravelPurposes
