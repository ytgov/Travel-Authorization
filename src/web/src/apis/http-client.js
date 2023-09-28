import axios from "axios"
import qs from "qs"

import { getInstance } from "@/auth"
import { apiBaseUrl } from "@/config"

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "brackets" })
  },
})

httpClient.interceptors.request.use(async (config) => {
  const auth0 = await getInstance()
  const accessToken = await auth0.getTokenSilently()
  config.headers["Authorization"] = `Bearer ${accessToken}`
  return config
})

export default httpClient
