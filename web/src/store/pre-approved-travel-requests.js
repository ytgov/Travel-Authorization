import preApprovedTravelRequestsApi from "@/api/pre-approved-travel-requests-api"

import { withGettersFromState } from "@/utils/vuex-utils"

const state = {
  items: [],
  isLoading: false,
  isErrored: false,
  isCached: false,
}

const getters = withGettersFromState(state, {
  isReady: (state) => state.isCached && !state.isLoading && !state.isErrored,
})

const actions = {
  async ensure({ commit, state, dispatch }, { where = {} } = {}) {
    if (state.isCached) {
      return state.items
    }

    commit("SET_IS_CACHED", false)
    return dispatch("fetch", { where })
  },
  async fetch({ commit }, { where = {} } = {}) {
    commit("SET_IS_LOADING", true)
    try {
      const { preApprovedTravelRequests } = await preApprovedTravelRequestsApi.list({ where })
      commit("SET_IS_ERRORED", false)
      commit("SET_ITEMS", preApprovedTravelRequests)
      commit("SET_IS_CACHED", true)
      return preApprovedTravelRequests
    } catch (error) {
      console.error("Failed to fetch pre-approved travel requests:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    } finally {
      commit("SET_IS_LOADING", false)
    }
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
