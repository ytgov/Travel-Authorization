import usersApi from "@/api/users-api"

import { sleep } from "@/utils/sleep"
import { withGettersFromState } from "@/utils/vuex-utils"

const state = {
  attributes: {
    roles: [],
  },
  isLoading: false,
  isErrored: false,
  isCached: false,
}

const getters = withGettersFromState(state, {
  isReady: (state) => state.isCached && !state.isLoading && !state.isErrored,
  id: (state) => state.attributes.id,
  fullName: (state) => {
    const { firstName, lastName } = state.attributes
    return [firstName, lastName].filter(Boolean).join(" ")
  },
})

const actions = {
  async ensure({ commit, getters, dispatch }) {
    while (state.isLoading) {
      await sleep(75)
    }

    if (state.isErrored) {
      console.error("User store has errored, returning {}.")
      return {}
    }

    if (getters.isCached) return getters.attributes

    commit("SET_IS_CACHED", false)
    return dispatch("fetch")
  },
  async fetch({ commit }) {
    commit("SET_IS_LOADING", true)
    try {
      const { user } = await usersApi.me()
      commit("SET_IS_ERRORED", false)
      commit("SET_ATTRIBUTES", user)
      commit("SET_IS_CACHED", true)
      return user
    } catch (error) {
      console.error("Failed to load current user:", error)
      commit("SET_IS_ERRORED", true)
      throw error
    } finally {
      commit("SET_IS_LOADING", false)
    }
  },

  async ygGovernmentDirectorySync({ getters, commit }) {
    commit("SET_IS_LOADING", true)
    try {
      const { user } = await usersApi.ygGovernmentDirectorySync(getters.id)
      commit("SET_IS_ERRORED", false)
      commit("SET_ATTRIBUTES", user)
      commit("SET_IS_CACHED", true)
      return user
    } catch (error) {
      console.error("Failed to sync current user with the YG government directory:", error)
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
