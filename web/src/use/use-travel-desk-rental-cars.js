import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskRentalCarsApi, {
  LOCATION_TYPES,
  TRAVEL_DESK_RENTAL_CAR_STATUSES,
  VEHICLE_TYPES,
} from "@/api/travel-desk-rental-cars-api"

export { LOCATION_TYPES, TRAVEL_DESK_RENTAL_CAR_STATUSES, VEHICLE_TYPES }

/**
 * TODO: add other fields
 * @typedef {Object} TravelDeskRentalCar
 * @property {number} id
 */

/**
 * Provides reactive state management for travelDeskRentalCars with API integration.
 *
 * @param {import('vue').Ref<{
 *   where?: { [key: string]: any },
 *   page?: number,
 *   perPage?: number
 * }>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travelDeskRentalCars.
 * @param {Object} [{ skipWatchIf = () => false }={}] - Configuration to conditionally skip API calls.
 * @param {Function} [skipWatchIf] - Function that returns a boolean to determine if fetching should be skipped.
 * @returns {{
 *   travelDeskRentalCars: import('vue').Ref<TravelDeskRentalCar[]>,
 *   totalCount: import('vue').Ref<number>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<TravelDeskRentalCar[]>,
 *   refresh: () => Promise<TravelDeskRentalCar[]>
 * }}
 */
export function useTravelDeskRentalCars(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelDeskRentalCars: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskRentalCars, totalCount } = await travelDeskRentalCarsApi.list(
        unref(options)
      )
      state.isErrored = false
      state.travelDeskRentalCars = travelDeskRentalCars
      state.totalCount = totalCount
      return travelDeskRentalCars
    } catch (error) {
      console.error("Failed to fetch travelDeskRentalCars:", error)
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

export default useTravelDeskRentalCars
