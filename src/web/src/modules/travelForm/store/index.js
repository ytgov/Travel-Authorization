import { FORM_URL, LOOKUP_URL } from "@/urls";
import { secureGet, securePost, securePut } from "@/store/jwt";

const state = {
  myForms: [],
  departments: [],
};

const actions = {
  async initialize() {
    console.log("-- Initializing travelForm Store");
  },

  async loadDepartments({ commit }) {
    return secureGet(`${LOOKUP_URL}/departmentList2`).then((resp) => {
      commit("SET_DEPARTMENTS", resp.data.data);
      return resp.data.data;
    });
  },

  async loadForms({ commit }) {
    return secureGet(`${FORM_URL}`).then((resp) => {
      commit("SET_MYFORMS", resp.data);
    });
  },

  selectForm({ commit }, form) {
    commit("SET_SELECTEDFORM", form);
  },

  async getAll() {
    return secureGet(FORM_URL).then((resp) => {
      return resp.data.data;
    });
  },

  async getById(store, { id }) {
    return secureGet(`${FORM_URL}/${id}`).then((resp) => {
      return resp.data.data;
    });
  },

  async create(store, { body }) {
    console.log(body);

    return securePost(FORM_URL, body).then((resp) => {
      return resp.data;
    });
  },

  async update(store, { item }) {
    let id = item.id;
    console.log(item);

    return securePut(`${FORM_URL}/${id}`, item).then((resp) => {
      return resp.data;
    });
  },

  async delete(store, { id }) {
    return securePost(`${FORM_URL}/${id}`).then((resp) => {
      return resp.data;
    });
  },
};

const mutations = {
  SET_MYFORMS(store, value) {
    store.myForms = value;
  },
  SET_SELECTEDFORM(store, value) {
    store.selectedForm = value;
  },
  SET_DEPARTMENTS(store, value) {
    store.departments = value;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
