const state = {
  destinations: [],  
};
const getters = {};
const mutations = {
  SET_DESTINATIONS(state, value) {
    state.destinations = value;
  },  
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
