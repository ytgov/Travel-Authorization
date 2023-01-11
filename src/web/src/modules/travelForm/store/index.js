import { FORM_URL } from "@/urls";
import { secureGet, securePost, securePut } from "@/utils/secure";

const state = {};

const actions = {
  async initialize() {
    console.log("-- Initializing Recovery Store");
  },
  async getAll() {
    return secureGet(FORM_URL).then(resp => {
      return resp.data.data;
    });
  },
  async getById(store, { id }) {
    return secureGet(`${FORM_URL}/${id}`).then(resp => {
      return resp.data.data;
    });
  },
  async create(store, { body }) {
    console.log(body);

    return securePost(FORM_URL, body).then(resp => {
      return resp.data;
    });
  },
  async update(store, { item }) {
    let id = item.id;
    console.log(item);

    return securePut(`${FORM_URL}/${id}`, item).then(resp => {
      return resp.data;
    });
  },
  async delete(store, { id }) {
    return securePost(`${FORM_URL}/${id}`).then(resp => {
      return resp.data;
    });
  }
};

const mutations = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
