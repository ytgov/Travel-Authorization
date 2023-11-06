import axios from "axios";

import { getInstance } from "../auth";
import { apiBaseUrl } from "../config";

// TODO: deprecate this file in favor of web/src/api/http-client.js
export async function prepareAxios() {
  const auth = await getInstance();
  const token = await auth.getTokenSilently();

  return axios.create({
    baseURL: apiBaseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

export async function secureGet(url, timeout) {
  let api = await prepareAxios();
  return api.get(url, {timeout: (timeout? timeout: 0)});
}

export async function securePut(url, body) {
  let api = await prepareAxios();
  return api.put(url, body);
}

export async function securePost(url, body) {
  let api = await prepareAxios();
  return api.post(url, body);
}

export async function secureDelete(url) {
  let api = await prepareAxios();
  return api.delete(url);
}
