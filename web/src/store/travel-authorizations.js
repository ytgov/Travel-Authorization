import travelAuthorizationsApi from "@/api/travel-authorizations-api"

import { withGettersFromState } from "@/utils/vuex-utils"

const state = {
  items: [],
  totalCount: 0,
  isLoading: false,
  isErrored: false,
  // isCached: false, // Caching is not implemented as it would need to invalidate on query params changes.
}

const getters = withGettersFromState(state, {})

const actions = {
  async ensure({ dispatch }, { where, page, perPage, ...otherParams } = {}) {
    return dispatch("fetch", { where, page, perPage, otherParams })
  },
  async fetch({ commit }, { where, page, perPage, ...otherParams } = {}) {
    commit("SET_IS_LOADING", true)
    try {
      const { travelAuthorizations, totalCount } = await travelAuthorizationsApi.list({
        where,
        page,
        perPage,
        otherParams,
      })
      commit("SET_IS_ERRORED", false)
      commit("SET_ITEMS", travelAuthorizations)
      commit("SET_TOTAL_COUNT", totalCount)

      return {
        items: state.items,
        totalCount: state.totalCount,
      }
    } catch (error) {
      console.error("Failed to load travel authorizations:", error)
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
  SET_TOTAL_COUNT(state, value) {
    state.totalCount = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
