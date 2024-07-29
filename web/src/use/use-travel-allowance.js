import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelAllowancesApi from "@/api/travel-allowances-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-allowances-api.js').TravelAllowance} TravelAllowance */

/**
 * @callback UseTravelAllowance
 * @param {Ref<number>} id
 * @returns {{
 *   travelAllowance: Ref<TravelAllowance | null | undefined>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelAllowance>,
 *   refresh: () => Promise<TravelAllowance>,
 * }}
 */

/** @type {UseTravelAllowance} */
export function useTravelAllowance(id) {
  const state = reactive({
    travelAllowance: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { travelAllowance } = await travelAllowancesApi.get(staticId)
      state.isErrored = false
      state.travelAllowance = travelAllowance
      return travelAllowance
    } catch (error) {
      console.error("Failed to fetch per diem:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) return

      await fetch()
    },
    {
      immediate: true,
    }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useTravelAllowance
