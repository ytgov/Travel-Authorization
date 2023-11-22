import travelAuthorizationsApi from "@/api/travel-authorizations-api"
import { TYPES as EXPENSE_TYPES } from "@/api/expenses-api"

import { withGettersFromState } from "@/utils/vuex-utils"

import stops from "./stops"

const state = {
  attributes: {
    expenses: [],
    purpose: {},
    stops: [], // load from stops sub-module?
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
      // TODO: dispatch update to stops sub-module?
      commit("SET_IS_CACHED", true)
      return travelAuthorization
    } catch (error) {
      console.error("Failed to load travel authorization:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    }
  },
  async save({ commit, state, getters }) {
    const travelAuthorizationId = getters.id
    const attributes = state.attributes

    commit("SET_IS_LOADING", true)
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
    } finally {
      commit("SET_IS_LOADING", false)
    }
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    stops,
  },
}
