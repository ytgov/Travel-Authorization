import { PROFILE_URL } from "../urls";
import { secureGet } from "./jwt";

const state = {
  firstName: "",
  lastName: "",
  email: "",
  id: "",
  username: "",
  roles: [],
  access: []
};
const getters = {
  firstName: state => state.first_name,
  lastName: state => state.lastName,
  email: state => state.email,
  id: state => state.id,
  username: state => state.username,
  roles: state => state.roles,
  access: state => state.access
};
const actions = {
  async loadProfile({ commit }) {
    await secureGet(PROFILE_URL)
      .then(resp => {
        commit("setProfile", resp.data.user);
      })
      .catch(() => {
        commit("auth/clearUser");
      });
  }
};
const mutations = {
  setProfile(state, profile) {
    state.firstName = profile.firstName;
    state.lastName = profile.lastName;
    state.email = profile.email;
    state.id = profile.id;
    state.username = profile.username;
    state.roles = profile.roles;
    state.access = profile.access;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
