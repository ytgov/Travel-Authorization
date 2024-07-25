import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import perDiemsApi from "@/api/per-diems-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/per-diems-api.js').PerDiem} PerDiem */

/**
 * @callback UsePerDiem
 * @param {Ref<number>} id
 * @returns {{
 *   perDiem: Ref<PerDiem | null | undefined>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<PerDiem>,
 *   refresh: () => Promise<PerDiem>,
 * }}
 */

/** @type {UsePerDiem} */
export function usePerDiem(id) {
  const state = reactive({
    perDiem: null,
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
      const { perDiem } = await perDiemsApi.get(staticId)
      state.isErrored = false
      state.perDiem = perDiem
      return perDiem
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

export default usePerDiem
