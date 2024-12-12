import { reactive, toRefs, ref, unref, watch } from "vue"

import travelAuthorizationsApi from "@/api/travel-authorizations-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-authorizations-api.js').TravelAuthorization} TravelAuthorization */
/** @typedef {import('@/api/travel-authorizations-api.js').TravelAuthorizationsQueryOptions} TravelAuthorizationsQueryOptions */

/**
 * Provides reactive state management for travel authorizations with API integration.
 *
 * @param {TravelAuthorizationsQueryOptions} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travel authorizations.
 * @param {Object} [{ skipWatchIf = () => false }={}] - Configuration to conditionally skip API calls.
 * @param {Function} [skipWatchIf] - Function that returns a boolean to determine if fetching should be skipped.
 * @returns {{
 *   travelAuthorizations: Ref<TravelAuthorization[]>,
 *   totalCount: Ref<number>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelAuthorization[]>,
 *   refresh: () => Promise<TravelAuthorization[]>
 * }}
 */
export function useTravelAuthorizations(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelAuthorizations: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelAuthorizations, totalCount } = await travelAuthorizationsApi.list(
        unref(options)
      )
      state.isErrored = false
      state.travelAuthorizations = travelAuthorizations
      state.totalCount = totalCount
      return travelAuthorizations
    } catch (error) {
      console.error("Failed to fetch travel authorizations:", error)
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

export default useTravelAuthorizations
