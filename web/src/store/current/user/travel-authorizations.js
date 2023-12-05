import travelAuthorizationsApi from "@/api/travel-authorizations-api"

import { withGettersFromState } from "@/utils/vuex-utils"

const state = {
  items: [],
  totalCount: 0,
  isLoading: false,
  isErrored: false,
  isCached: false,
}

const getters = withGettersFromState(state, {})

const actions = {
  async ensure({ commit, dispatch }, { page, perPage, ...otherParams } = {}) {
    commit("SET_IS_LOADING", true)
    try {
      const { id: currentUserId } = await dispatch("current/user/ensure", null, { root: true })
      const { travelAuthorizations, totalCount } = await travelAuthorizationsApi.list({
        page,
        perPage,
        ...otherParams,
        where: { userId: currentUserId },
      })
      commit("SET_IS_ERRORED", false)
      commit("SET_ITEMS", travelAuthorizations)
      commit("SET_TOTAL_COUNT", totalCount)
      commit("SET_IS_ENSURE", true)

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
  SET_IS_ENSURE(state, value) {
    state.isCached = value
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
