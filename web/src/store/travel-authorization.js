import travelAuthorizationsApi from "@/api/travel-authorizations-api"

import { withGettersFromState } from "@/utils/vuex-utils"

const state = {
  attributes: {
    expenses: [],
    purpose: {},
    stops: [],
    user: {},
  },
  isLoading: false,
  isErrored: false,
  isInitialized: false,
}

const getters = withGettersFromState(state, {
  id: (state) => state.attributes.id,
})

const actions = {
  async initialize({ state, dispatch, getters }, travelAuthorizationId) {
    if (state.isInitialized && getters.id === travelAuthorizationId) {
      return state.attributes
    }

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
      commit("SET_IS_INITIALIZED", true)
      return state.attributes
    } catch (error) {
      console.error("Failed to load travel authorization:", error)
      commit("SET_IS_ERRORED", true)
      throw error
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
  SET_IS_INITIALIZED(state, value) {
    state.isInitialized = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
