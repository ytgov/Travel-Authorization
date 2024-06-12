import usersApi from "@/api/users-api"

/**
 * @typedef {import("@/api/users-api").User} User
 */

/**
 * @typedef State
 * @type {Object}
 * @property {(User|null)} user
 * @property {string} fullName
 * @property {string[]} roles
 * @property {string} department
 */

/** @type {State} */
const state = {
  user: null,
  fullName: "",
  roles: [],
  department: "",
}

/**
 * @typedef {} Getters
 */

/** @type {import('vuex').GetterTree<State, any>} */
const getters = {
  isAuthenticated: (state) => !!state.user,
  fullName: (state) => {
    return state.fullName
  },
  user: (state) => {
    return state.user
  },
}

const actions = {
  async checkAuthentication({ commit }) {
    try {
      const { user } = await usersApi.me()
      commit("setUser", user)
    } catch {
      commit("clearUser")
    }
  },
  UpdateUserDepartment({ commit }, value) {
    commit("setDepartment", value)
  },
}

const mutations = {
  setUser(state, user) {
    state.user = user
    state.fullName = user.displayName
    state.roles = user.roles
    state.department = user.department
  },
  clearUser(state) {
    state.user = null
    state.fullName = null
    state.roles = []
    state.department = null
  },
  setDepartment(state, department) {
    state.department = department
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
