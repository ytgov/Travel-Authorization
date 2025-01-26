import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskHotelsApi from "@/api/travel-desk-hotels-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/base-api.js').Policy} Policy */
/** @typedef {import('@/api/travel-desk-hotels-api.js').TravelDeskHotel} TravelDeskHotel */

/**
 * @callback UseTravelDeskHotel
 * @param {Ref<number | null | undefined>} id
 * @returns {{
 *   travelDeskHotel: Ref<TravelDeskHotel | null>,
 *   policy: Ref<Policy | null>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskHotel>,
 *   refresh: () => Promise<TravelDeskHotel>,
 * }}
 */

/** @type {UseTravelDeskHotel} */
export function useTravelDeskHotel(id) {
  const state = reactive({
    travelDeskHotel: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskHotel, policy } = await travelDeskHotelsApi.get(unref(id))
      state.isErrored = false
      state.travelDeskHotel = travelDeskHotel
      state.policy = policy
      return travelDeskHotel
    } catch (error) {
      console.error("Failed to fetch travel desk hotel:", error)
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

export default useTravelDeskHotel
