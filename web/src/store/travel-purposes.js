import travelPurposesApi from "@/api/travel-purposes-api"

import { withGettersFromState } from "@/utils/vuex-utils"

const state = {
  items: [],
  isLoading: false,
  isErrored: false,
  isCached: false,
}

const getters = withGettersFromState(state, {})

const actions = {
  async ensure({ commit, state, dispatch }) {
    if (state.isCached) {
      return state.items
    }

    commit("SET_IS_CACHED", false)
    return dispatch("fetch")
  },
  async fetch({ commit }) {
    commit("SET_IS_LOADING", true)
    try {
      const { travelPurposes } = await travelPurposesApi.list()
      commit("SET_IS_ERRORED", false)
      commit("SET_ITEMS", travelPurposes)
      commit("SET_IS_CACHED", true)
      return travelPurposes
    } catch (error) {
      console.error("Failed to fetch travel purposes:", error)
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
