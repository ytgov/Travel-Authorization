import { PROFILE_URL } from "../urls";
import { secureGet } from "./jwt";

const state = {
  user: null,
  fullName: "",
  roles: [],
  department: ""
};
const getters = {
  isAuthenticated: state => !!state.user,
  fullName: state => {
    return state.fullName;
  },
  user: state => {
    return state.user;
  }
};
const actions = {
  async checkAuthentication({ commit }) {
    await secureGet(PROFILE_URL)
      .then(resp => {
        commit("setUser", resp.data.data);
      })
      .catch(() => {
        commit("clearUser");
      });
  },
  UpdateUserDepartment({ commit }, value) {
    commit("setDepartment", value);
  }
};
const mutations = {
  setUser(state, user) {
    state.user = user;
    state.fullName = user.display_name;
    state.roles = user.roles;
    state.department = user.department;
  },
  clearUser(state) {
    state.user = null;
    state.fullName = null;
    state.roles = [];
    state.department = null;
  },
  setDepartment(state, department) {
    state.department = department;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
