import { isNil } from "lodash"

import travelAuthorizationsApi, { STATUSES } from "@/api/travel-authorizations-api"
import { TYPES as EXPENSE_TYPES } from "@/api/expenses-api"

import { withGettersFromState } from "@/utils/vuex-utils"

// FUTURE: make state per-id. i.e state[travelAuthorizationId] = { ... }
const state = {
  attributes: {
    expenses: [],
    purpose: {},
    stops: [],
    travelSegments: [],
    user: {},
  },
  isLoading: false,
  isErrored: false,
  isCached: false,
}

const getters = withGettersFromState(state, {
  isReady: (state) => state.isCached && !state.isLoading && !state.isErrored,
  id: (state) => state.attributes.id,
  estimates: (state) =>
    state.attributes.expenses?.filter((expense) => expense.type === EXPENSE_TYPES.ESTIMATE),
  stops: (state) => state.attributes.stops,
  firstStop: (state) => state.attributes.stops[0] || {},
  lastStop: (state) => state.attributes.stops[state.attributes.stops.length - 1] || {},
  // TODO: probably load from back-end policy in the future to avoid duplication of complex logic
  isEditableByUser: (state) => (userId) => {
    if (state.attributes.userId === userId && state.attributes.status === STATUSES.DRAFT) {
      return true
    }

    return false
  },
  isEditable: (_state, getters, _rootState, rootGetters) => {
    const currentUserId = rootGetters["current/user/id"]
    return getters.isEditableByUser(currentUserId)
  },
  isBeforeTravelStartDate(state) {
    const firstTravelSegment = state.attributes.travelSegments[0]
    if (isNil(firstTravelSegment)) return false

    return new Date(firstTravelSegment.departureOn) > new Date()
  },
  isAfterTravelStartDate(_state, getters) {
    return !getters.isBeforeTravelStartDate
  },
  isExpenseEditable: (state, getters) => {
    return state.attributes.status === STATUSES.APPROVED && getters.isAfterTravelStartDate
  },
})

const actions = {
  async ensure({ commit, state, dispatch, getters }, travelAuthorizationId) {
    if (getters.isCached && getters.id === travelAuthorizationId) {
      return state.attributes
    }

    commit("SET_IS_CACHED", false)
    return dispatch("fetch", travelAuthorizationId)
  },
  async fetch({ commit, dispatch }, travelAuthorizationId) {
    commit("SET_IS_LOADING", true)
    try {
      return dispatch("fetchSilently", travelAuthorizationId)
    } finally {
      commit("SET_IS_LOADING", false)
    }
  },
  async fetchSilently({ commit }, travelAuthorizationId) {
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.get(travelAuthorizationId)
      commit("SET_IS_ERRORED", false)
      commit("SET_ATTRIBUTES", travelAuthorization)
      commit("SET_IS_CACHED", true)
      return travelAuthorization
    } catch (error) {
      console.error("Failed to load travel authorization:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    }
  },
  async fetchExpensesSilently({ commit }, travelAuthorizationId) {
    try {
      const {
        travelAuthorization: { expenses },
      } = await travelAuthorizationsApi.get(travelAuthorizationId)
      commit("SET_IS_ERRORED", false)
      commit("SET_EXPENSES", expenses)
      commit("SET_IS_CACHED", true)
      return expenses
    } catch (error) {
      console.error("Failed to load travel authorization:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    }
  },
  async create({ commit }, attributes) {
    commit("SET_IS_LOADING", true)
    try {
      const { travelAuthorization } = await travelAuthorizationsApi.create(attributes)
      commit("SET_IS_ERRORED", false)
      commit("SET_ATTRIBUTES", travelAuthorization)
      commit("SET_IS_CACHED", true)
      return travelAuthorization
    } catch (error) {
      console.error("Failed to create travel authorization:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    } finally {
      commit("SET_IS_LOADING", false)
    }
  },
  async save({ commit, dispatch }) {
    commit("SET_IS_LOADING", true)
    try {
      return dispatch("saveSilently")
    } finally {
      commit("SET_IS_LOADING", false)
    }
  },
  async saveSilently({ commit, state, getters }) {
    const travelAuthorizationId = getters.id
    const attributes = state.attributes

    try {
      const { travelAuthorization } = await travelAuthorizationsApi.update(
        travelAuthorizationId,
        attributes
      )
      commit("SET_IS_ERRORED", false)
      commit("SET_ATTRIBUTES", travelAuthorization)
      return travelAuthorization
    } catch (error) {
      console.error("Failed to update travel authorization:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    }
  },
  newBlankStop({ getters }, attributes) {
    return {
      travelAuthorizationId: getters.id,
      ...attributes,
    }
  },
  replaceStops({ commit, getters }, stops) {
    commit("SET_ATTRIBUTES", {
      ...getters.attributes,
      stops,
    })

    return stops
  },
}

const mutations = {
  SET_ATTRIBUTES(state, value) {
    state.attributes = value
  },
  SET_IS_LOADING(state, value) {
    state.isLoading = value
  },
  SET_IS_ERRORED(state, value) {
    state.isErrored = value
  },
  SET_IS_CACHED(state, value) {
    state.isCached = value
  },
  // TODO: replace this with back-end state management
  SET_STATUS(state, value) {
    state.attributes.status = value
  },
  SET_EXPENSES(state, value) {
    state.attributes.expenses = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
