import { isString } from "lodash"

import { LOOKUP_URL } from "@/urls"
import { secureGet } from "@/store/jwt"

import expensesApi from "@/api/expenses-api"

const state = {
  departments: [],
  emails: [],
  estimates: [],
  loadingEstimates: true,
}

const getters = {}

const actions = {
  async initialize(store) {
    await store.dispatch("loadDepartments")
  },
  async emailSearch({ commit }, token) {
    if (isString(token) && token.length >= 3) {
      const { data: emails } = await secureGet(`${LOOKUP_URL}/emailList?email=${token}`)
      commit("SET_EMAILS", emails)
    } else {
      commit("SET_EMAILS", [])
    }
    return this.emails
  },
  async loadDepartments({ commit }) {
    return secureGet(`${LOOKUP_URL}/departmentList2`).then((resp) => {
      commit("SET_DEPARTMENTS", resp.data.data)
      return resp.data.data
    })
  },
  loadEstimates({ commit, state }, { travelAuthorizationId }) {
    state.loadingEstimates = true
    return expensesApi
      .list({ where: { travelAuthorizationId, type: expensesApi.TYPES.ESTIMATE } })
      .then(({ expenses: estimates }) => {
        commit("SET_ESTIMATES", estimates)
        return estimates
      })
      .finally(() => {
        state.loadingEstimates = false
      })
  },
}

const mutations = {
  SET_EMAILS(store, value) {
    store.emails = value
  },
  SET_DEPARTMENTS(store, value) {
    store.departments = value
  },
  SET_ESTIMATES(store, value) {
    store.estimates = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
