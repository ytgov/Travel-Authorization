import { computed, reactive, toRefs, unref, watch } from "vue"
import { isNumber } from "lodash"

import travelAuthorizationsApi, { STATUSES } from "@/api/travel-authorizations-api"

import { defineUse } from "@/use/helper-utils"

/**
 * TODO: add other fields
 * @typedef {Object} TravelAuthorization
 * @property {number} id
 * @property {Expense[]} expenses
 * @property {Purpose} purpose
 * @property {Stop[]} stops
 * @property {TravelSegment[]} travelSegments
 * @property {User} user
 */

/**
 * This stores a global user state per id.
 *
 * @callback UseTravelAuthorization
 * @param {import('vue').Ref<number>} travelAuthorizationId
 * @returns {{
 *   travelAuthorization: import('vue').Ref<TravelAuthorization>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   stops: import('vue').Ref<Stop[]>,
 *   firstStop: import('vue').Ref<Stop>,
 *   lastStop: import('vue').Ref<Stop>,
 *   fetch: () => Promise<TravelAuthorization>,
 *   save: () => Promise<TravelAuthorization>, // save that triggers loading state
 *   saveSilently: () => Promise<TravelAuthorization>, // save that does not trigger loading state
 *   create: (attributes: Partial<TravelAuthorization>) => Promise<TravelAuthorization>,
 *   newBlankStop: (attributes: Partial<Stop>) => Stop,
 *   replaceStops: (stops: Stop[]) => Stop[],
 *   approve: () => Promise<TravelAuthorization>,
 *   deny: ({ denialReason: string } = {}) => Promise<TravelAuthorization>,
 *   expenseClaim: (attributes) => Promise<TravelAuthorization>,
 * }}
 */

/** @type {UseTravelAuthorization} */
export const useTravelAuthorization = defineUse((travelAuthorizationId) => {
  const state = reactive({
    travelAuthorization: {
      expenses: [],
      purpose: {},
      stops: [],
      travelSegments: [],
      user: {},
    },
    isLoading: false,
    isErrored: false,
  })

  async function fetch(params = {}) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.get(
        unref(travelAuthorizationId),
        params
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to fetch travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save() {
    state.isLoading = true
    try {
      return saveSilently()
    } finally {
      state.isLoading = false
    }
  }

  async function saveSilently() {
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.update(
        unref(travelAuthorizationId),
        state.travelAuthorization
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to update travel authorization:", error)
      state.isErrored = true
      throw error
    }
  }

  async function create(attributes) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.create(attributes)
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to create travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // Stateful actions
  async function approve() {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.approve(
        unref(travelAuthorizationId)
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to approve for travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function deny({ denialReason } = {}) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.deny(
        unref(travelAuthorizationId),
        { denialReason }
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to deny for travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function expenseClaim(attributes) {
    state.isLoading = true
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.expenseClaim(
        unref(travelAuthorizationId),
        attributes
      )
      state.isErrored = false
      state.travelAuthorization = travelAuthorization
      return travelAuthorization
    } catch (error) {
      console.error("Failed to submit expense claim for travel authorization:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(travelAuthorizationId),
    async (newTravelAuthorizationId) => {
      if (!isNumber(newTravelAuthorizationId)) return

      await fetch()
    },
    { immediate: true }
  )

  const stops = computed(() => state.travelAuthorization.stops)
  const firstStop = computed(() => stops.value[0] || {})
  const lastStop = computed(() => stops.value[stops.value.length - 1] || {})

  function newBlankStop(attributes) {
    return {
      travelAuthorizationId: state.travelAuthorization.id,
      ...attributes,
    }
  }

  // In the future it might make sense to directly update stops in the back-end
  function replaceStops(stops) {
    state.travelAuthorization = {
      ...state.travelAuthorization,
      stops,
    }

    return stops
  }

  return {
    STATUSES,
    ...toRefs(state),
    // computed attributes
    stops,
    firstStop,
    lastStop,
    // methods
    fetch,
    save,
    create,
    newBlankStop,
    replaceStops,
    // stateful action
    approve,
    deny,
    expenseClaim,
  }
})

export default useTravelAuthorization
