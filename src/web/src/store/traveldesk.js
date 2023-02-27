const state = {
  destinations: [],
  travelDeskUsers: [],  
};
const getters = {};
const mutations = {
  SET_DESTINATIONS(state, value) {
    state.destinations = value;
  },  
  SET_TRAVEL_DESK_USERS(state, value) {
    state.travelDeskUsers = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
