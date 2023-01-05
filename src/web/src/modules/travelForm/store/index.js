import axios from "axios";
import { FORM_URL } from "@/urls";

const state = {};

const actions = {
  async initialize() {
    console.log("-- Initializing Recovery Store");
  },
  async getAll() {
    return axios.get(FORM_URL).then(resp => {
      return resp.data.data;
    });
  },
  async getById(store, { id }) {
    return axios.get(`${FORM_URL}/${id}`).then(resp => {
      return resp.data.data;
    });
  },
  async create(store, { body }) {
    console.log(body);

    return axios.post(FORM_URL, body).then(resp => {
      return resp.data;
    });
  },
  async update(store, { item }) {
    let id = item.id;
    console.log(item);

    return axios.put(`${FORM_URL}/${id}`, item).then(resp => {
      return resp.data;
    });
  },
  async delete(store, { id }) {
    return axios.post(`${FORM_URL}/${id}`).then(resp => {
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
