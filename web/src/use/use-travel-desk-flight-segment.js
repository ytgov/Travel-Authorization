import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskFlightSegmentsApi from "@/api/travel-desk-flight-segments-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/base-api.js').Policy} Policy */
/** @typedef {import('@/api/travel-desk-flight-segments-api.js').TravelDeskFlightSegment} TravelDeskFlightSegment */

/**
 * @callback UseTravelDeskFlightSegment
 * @param {Ref<number | null | undefined>} id
 * @returns {{
 *   travelDeskFlightSegment: Ref<TravelDeskFlightSegment | null>,
 *   policy: Ref<Policy | null>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskFlightSegment>,
 *   refresh: () => Promise<TravelDeskFlightSegment>,
 * }}
 */

/** @type {UseTravelDeskFlightSegment} */
export function useTravelDeskFlightSegment(id) {
  const state = reactive({
    travelDeskFlightSegment: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskFlightSegment, policy } = await travelDeskFlightSegmentsApi.get(unref(id))
      state.isErrored = false
      state.travelDeskFlightSegment = travelDeskFlightSegment
      state.policy = policy
      return travelDeskFlightSegment
    } catch (error) {
      console.error("Failed to fetch travel desk flight segment:", error)
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

export default useTravelDeskFlightSegment
