import axios from "axios";
import { LOGOUT_URL, PROFILE_URL } from "../urls";

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
    await axios
      .get(PROFILE_URL)
      .then(resp => {
        commit("setUser", resp.data.data);
      })
      .catch(() => {
        commit("clearUser");
      });
  },
  async signOut({ commit }) {
    await axios
      .get(LOGOUT_URL)
      .then(() => {
        commit("clearUser");
      })
      .catch(err => {
        console.error(err);
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
