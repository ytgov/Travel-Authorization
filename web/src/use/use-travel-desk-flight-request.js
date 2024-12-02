import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskFlightRequestsApi from "@/api/travel-desk-flight-requests-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/base-api.js').Policy} Policy */
/** @typedef {import('@/api/travel-desk-flight-requests-api.js').TravelDeskFlightRequest} TravelDeskFlightRequest */

/**
 * @callback UseTravelDeskFlightRequest
 * @param {Ref<number | null | undefined>} id
 * @returns {{
 *   travelDeskFlightRequest: Ref<TravelDeskFlightRequest | null>,
 *   policy: Ref<Policy | null>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskFlightRequest>,
 *   refresh: () => Promise<TravelDeskFlightRequest>,
 * }}
 */

/** @type {UseTravelDeskFlightRequest} */
export function useTravelDeskFlightRequest(id) {
  const state = reactive({
    travelDeskFlightRequest: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskFlightRequest, policy } = await travelDeskFlightRequestsApi.get(unref(id))
      state.isErrored = false
      state.travelDeskFlightRequest = travelDeskFlightRequest
      state.policy = policy
      return travelDeskFlightRequest
    } catch (error) {
      console.error("Failed to fetch travel desk flight request:", error)
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

export default useTravelDeskFlightRequest
