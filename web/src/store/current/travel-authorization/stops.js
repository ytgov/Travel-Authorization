import stopsApi, { ACCOMMODATION_TYPES, TRAVEL_METHODS } from "@/api/stops-api"

import { withGettersFromState } from "@/utils/vuex-utils"

const UNSET_TRAVEL_AUTHORIZATION_ID = -1

const state = {
  items: [],
  travelAuthorizationId: UNSET_TRAVEL_AUTHORIZATION_ID,
  isLoading: false,
  isErrored: false,
  isCached: false,
}

const getters = withGettersFromState(state, {
  isReady: (state) => state.isCached && !state.isLoading && !state.isErrored,
  firstStop: (state) => state.items[0] || {},
  lastStop: (state) => state.items[state.items.length - 1] || {},
})

const actions = {
  async ensure({ commit, dispatch }, travelAuthorizationId) {
    if (getters.isCached && getters.travelAuthorizationId === travelAuthorizationId) {
      return getters.items
    }

    commit("SET_IS_CACHED", false)
    return dispatch("fetch", travelAuthorizationId)
  },
  async fetch({ commit }, travelAuthorizationId) {
    commit("SET_IS_LOADING", true)
    try {
      commit("SET_TRAVEL_AUTHORIZATION_ID", travelAuthorizationId)
      const { stops } = await stopsApi.list({ where: { travelAuthorizationId } })
      commit("SET_IS_ERRORED", false)
      commit("SET_ITEMS", stops)
      commit("SET_IS_CACHED", true)
      return stops
    } catch (error) {
      console.error("Failed to load travel authorization:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    } finally {
      commit("SET_IS_LOADING", false)
    }
  },
  newStop({ getters }, attributes) {
    return {
      travelAuthorizationId: getters.travelAuthorizationId,
      accommodationType: ACCOMMODATION_TYPES.HOTEL,
      transport: TRAVEL_METHODS.AIRCRAFT,
      ...attributes,
    }
  },
  replaceStops({ commit }, stops) {
    commit("SET_ITEMS", stops)

    return stops
  },
}

const mutations = {
  SET_ITEMS(state, value) {
    state.items = value
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
  SET_TRAVEL_AUTHORIZATION_ID(state, value) {
    state.travelAuthorizationId = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
