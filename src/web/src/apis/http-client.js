import axios from "axios";

import { getInstance } from "@/auth";
import { apiBaseUrl } from "@/config";

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(async config => {
  const auth0 = await getInstance();
  const accessToken = await auth0.getTokenSilently();
  config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

export default httpClient;
