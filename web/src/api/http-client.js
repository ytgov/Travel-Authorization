import axios from "axios"
import qs from "qs"

import { getInstance } from "@/auth"
import { apiBaseUrl } from "@/config"

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: "brackets" })
    },
  },
})

httpClient.interceptors.request.use(async (config) => {
  const auth0 = await getInstance()
  const accessToken = await auth0.getTokenSilently()
  config.headers["Authorization"] = `Bearer ${accessToken}`
  return config
})

// Any status codes that falls outside the range of 2xx causes this function to trigger
httpClient.interceptors.response.use(null, async (error) => {
  // Auth0 error type is unknown but it sets the error.error property to "login_required"
  // Bounce the user if they hit a login required error when trying to access a protected route
  // It would probably be better to move this code to a route guard or something?
  if (error?.error === "login_required") {
    const auth0 = await getInstance()
    auth0.loginWithRedirect({ appState: { targetUrl: window.location.pathname } })
  } else if (error?.response?.data?.message) {
    throw new Error(error.response.data.message)
  } else if (error.message) {
    throw new Error(error.message)
  } else {
    throw new Error("An unknown error occurred")
  }
})

export default httpClient
