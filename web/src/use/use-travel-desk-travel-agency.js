import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskTravelAgenciesApi from "@/api/travel-desk-travel-agencies-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-desk-travel-agencies-api.js').TravelDeskTravelAgency} TravelDeskTravelAgency */

/**
 * @callback UseTravelDeskTravelAgency
 * @param {Ref<number | string | null>} id
 * @returns {{
 *   travelDeskTravelAgency: Ref<TravelDeskTravelAgency | null | undefined>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskTravelAgency>,
 *   refresh: () => Promise<TravelDeskTravelAgency>,
 * }}
 */

/** @type {UseTravelDeskTravelAgency} */
export function useTravelDeskTravelAgency(id) {
  const state = reactive({
    travelDeskTravelAgency: null,
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
      const { travelDeskTravelAgency } = await travelDeskTravelAgenciesApi.get(staticId)
      state.isErrored = false
      state.travelDeskTravelAgency = travelDeskTravelAgency
      return travelDeskTravelAgency
    } catch (error) {
      console.error("Failed to fetch travel desk travel agency:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save() {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { travelDeskTravelAgency } = await travelDeskTravelAgenciesApi.update(
        staticId,
        state.travelDeskTravelAgency
      )
      state.isErrored = false
      state.travelDeskTravelAgency = travelDeskTravelAgency
      return travelDeskTravelAgency
    } catch (error) {
      console.error("Failed to update travel desk travel agency:", error)
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
    save,
  }
}

export default useTravelDeskTravelAgency
