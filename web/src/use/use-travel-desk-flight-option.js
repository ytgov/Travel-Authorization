import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskFlightOptionsApi from "@/api/travel-desk-flight-options-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/base-api.js').Policy} Policy */
/** @typedef {import('@/api/travel-desk-flight-options-api.js').TravelDeskFlightOption} TravelDeskFlightOption */

/**
 * @callback UseTravelDeskFlightOption
 * @param {Ref<number | null | undefined>} id
 * @returns {{
 *   travelDeskFlightOption: Ref<TravelDeskFlightOption | null>,
 *   policy: Ref<Policy | null>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskFlightOption>,
 *   refresh: () => Promise<TravelDeskFlightOption>,
 * }}
 */

/** @type {UseTravelDeskFlightOption} */
export function useTravelDeskFlightOption(id) {
  const state = reactive({
    travelDeskFlightOption: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskFlightOption, policy } = await travelDeskFlightOptionsApi.get(unref(id))
      state.isErrored = false
      state.travelDeskFlightOption = travelDeskFlightOption
      state.policy = policy
      return travelDeskFlightOption
    } catch (error) {
      console.error("Failed to fetch travel desk flight option:", error)
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

export default useTravelDeskFlightOption
