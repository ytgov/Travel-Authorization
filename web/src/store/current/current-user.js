import usersApi from "@/api/users-api"

const state = {
  currentUser: {},
  loadingCurrentUser: true,
  erroredCurrentUser: false,
  initializedCurrentUser: false,
}

const getters = {
  fullName: (state) => {
    const { firstName, lastName } = state.currentUser
    return `${firstName} ${lastName}`
  },
}

const actions = {
  async loadCurrentUser({ commit }) {
    commit("SET_LOADING_CURRENT_USER", true)
    try {
      const { user } = await usersApi.me()
      commit("SET_CURRENT_USER", user)
      commit("SET_INITIALIZED_CURRENT_USER", true)
      commit("SET_ERRORED_CURRENT_USER", false)
      return state.currentUser
    } catch (error) {
      console.error("Failed to load current user:", error)
      commit("SET_ERRORED_CURRENT_USER", true)
    } finally {
      commit("SET_LOADING_CURRENT_USER", false)
    }
  },
}

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  SET_LOADING_CURRENT_USER(state, loading) {
    state.loadingCurrentUser = loading
  },
  SET_ERRORED_CURRENT_USER(state, errored) {
    state.erroredCurrentUser = errored
  },
  SET_INITIALIZED_CURRENT_USER(state, initialized) {
    state.initializedCurrentUser = initialized
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
