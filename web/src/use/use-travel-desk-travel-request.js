import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskTravelRequestsApi, {
  TRAVEL_DESK_TRAVEL_REQUEST_STATUSES,
} from "@/api/travel-desk-travel-requests-api"

export { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES }

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-desk-travel-requests-api.js').TravelDeskTravelRequest} TravelDeskTravelRequest */
/** @typedef {import('@/api/travel-desk-travel-requests-api.js').TravelDeskTravelRequestStatuses} TravelDeskTravelRequestStatuses */

/**
 * Provides reactive state management for travelDeskTravelRequest with API integration.
 *
 * @param {Ref<number | string | null | undefined>} travelDeskTravelRequestId
 * @returns {{
 *   travelDeskTravelRequest: Ref<TravelDeskTravelRequest>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskTravelRequest>,
 *   refresh: () => Promise<TravelDeskTravelRequest>
 * }}
 */
export function useTravelDeskTravelRequest(travelDeskTravelRequestId) {
  const state = reactive({
    travelDeskTravelRequest: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskTravelRequest } = await travelDeskTravelRequestsApi.get(
        unref(travelDeskTravelRequestId)
      )
      state.isErrored = false
      state.travelDeskTravelRequest = travelDeskTravelRequest
      return travelDeskTravelRequest
    } catch (error) {
      console.error("Failed to fetch travel desk travel request:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save() {
    state.isLoading = true
    try {
      const { travelDeskTravelRequest } = await travelDeskTravelRequestsApi.update(
        unref(travelDeskTravelRequestId),
        state.travelDeskTravelRequest
      )
      state.isErrored = false
      state.travelDeskTravelRequest = travelDeskTravelRequest
      return travelDeskTravelRequest
    } catch (error) {
      console.error("Failed to save travel desk travel request:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function submit() {
    state.isLoading = true
    try {
      const { travelDeskTravelRequest } = await travelDeskTravelRequestsApi.submit(
        unref(travelDeskTravelRequestId),
        state.travelDeskTravelRequest
      )
      state.isErrored = false
      state.travelDeskTravelRequest = travelDeskTravelRequest
      return travelDeskTravelRequest
    } catch (error) {
      console.error("Failed to submit travel desk travel request:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(travelDeskTravelRequestId),
    async (newId) => {
      if (isNil(newId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
    save,
    submit,
  }
}

export default useTravelDeskTravelRequest
