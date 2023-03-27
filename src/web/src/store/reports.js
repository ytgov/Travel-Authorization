const state = {
	departments: []
};
const getters = {};
const mutations = {

	SET_DEPARTMENT(state, value) {
		state.departments = value;
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations
};