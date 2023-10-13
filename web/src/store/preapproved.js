const state = {
  employees: [],
  travelPurposes: [],
  departmentBranch: {},
  openDialogId: ""
};
const getters = {};
const mutations = {
  SET_EMPLOYEES(state, value) {
    state.employees = value;
  },
  SET_DEPARTMENT_BRANCH(state, value) {
    state.departmentBranch = value;
  },
  SET_OPEN_DIALOG_ID(state, value) {
    state.openDialogId = value;
  },
  SET_TRAVEL_PURPOSES(state, value){
    state.travelPurposes = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
