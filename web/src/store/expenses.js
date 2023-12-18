import expensesApi, { TYPES } from "@/api/expenses-api"

import { withGettersFromState } from "@/utils/vuex-utils"

const state = {
  items: [],
  isLoading: false,
  isErrored: false,
  // isCached: false, // Caching is not implemented as it would need to invalidate on query params changes.
}

const getters = withGettersFromState(state, {
  estimates: (state) => state.items.filter((item) => item.type === TYPES.ESTIMATE),
})

const actions = {
  async ensure({ dispatch }, { where, page, perPage, ...otherParams } = {}) {
    return dispatch("fetch", { where, page, perPage, ...otherParams })
  },
  async fetch({ commit }, { where, page, perPage, ...otherParams } = {}) {
    commit("SET_IS_LOADING", true)
    try {
      const { expenses } = await expensesApi.list({ where, page, perPage, ...otherParams })
      commit("SET_IS_ERRORED", false)
      commit("SET_ITEMS", expenses)
      return expenses
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
