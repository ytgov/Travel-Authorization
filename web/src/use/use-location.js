import { reactive, toRefs, unref, watch } from "vue"

import locationsApi from "@/api/locations-api"

/**
 * TODO: add other fields
 * @typedef {Object} Location
 * @property {number} id
 */

/**
 * This function retrieves and processes location data based on a given location ID.
 *
 * @param {import('vue').Ref<number>} locationId
 * @returns {{
 *   location: import('vue').Ref<Location>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<Location>,
 *   refresh: () => Promise<Location>,
 * }}
 */
export function useLocation(locationId) {
  const state = reactive({
    location: {},
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { location } = await locationsApi.fetch(unref(locationId))
      state.isErrored = false
      state.location = location
      return location
    } catch (error) {
      console.error("Failed to fetch location:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(locationId),
    async (newLocationId) => {
      if ([undefined, null].includes(newLocationId)) return

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

export default useLocation
