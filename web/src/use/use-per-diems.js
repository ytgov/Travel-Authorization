import { reactive, toRefs, ref, unref, watch } from "vue"

import perDiemsApi, {
  PER_DIEM_CLAIM_TYPES,
  PER_DIEM_TRAVEL_REGIONS,
  PER_DIEM_CURRENCY_TYPES,
} from "@/api/per-diems-api"

export { PER_DIEM_CLAIM_TYPES, PER_DIEM_TRAVEL_REGIONS, PER_DIEM_CURRENCY_TYPES }

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/per-diems-api.js').PerDiem} PerDiem */
/** @typedef {import('@/api/per-diems-api.js').PerDiemWhereOptions} PerDiemWhereOptions */
/** @typedef {import('@/api/per-diems-api.js').PerDiemFiltersOptions} PerDiemFiltersOptions */

/**
 * Provides reactive state management for per diems with API integration.
 *
 * @callback UsePerDiems
 * @param {Ref<{
 *   where?: PerDiemWhereOptions;
 *   filters?: PerDiemFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching per diems.
 * @param {{
 *  skipWatchIf?: () => boolean;
 * }} [config={ skipWatchIf = () => false } = {}] - Configuration to conditionally skip API calls.
 * @returns {{
 *   perDiems: Ref<PerDiem[]>,
 *   totalCount: Ref<number>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<PerDiem[]>,
 *   refresh: () => Promise<PerDiem[]>
 * }}
 */

/** @type {UsePerDiems} */
export function usePerDiems(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    perDiems: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  /** @returns {Promise<PerDiem[]>} */
  async function fetch() {
    state.isLoading = true
    try {
      const { perDiems, totalCount } = await perDiemsApi.list(unref(options))
      state.isErrored = false
      state.perDiems = perDiems
      state.totalCount = totalCount
      return perDiems
    } catch (error) {
      console.error("Failed to fetch per diems:", error)
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

export default usePerDiems
