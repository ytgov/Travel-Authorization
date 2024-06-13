import { reactive, toRefs } from "vue"
import { Auth0Client } from "@auth0/auth0-spa-js"

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, ENVIRONMENT } from "@/config"
import router from "@/router"

export const auth0 = new Auth0Client({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: AUTH0_AUDIENCE,
    redirect_uri: window.location.origin,
  },
  cacheLocation: ENVIRONMENT === "development" ? "localstorage" : "memory",
})

const state = reactive({
  isLoading: true,
  isAuthenticated: false,
  user: undefined,
  idTokenClaims: undefined,
  error: null,
})

export function useAuth0({ initialize = false } = {}) {
  if (initialize) {
    __checkSession()
  }

  async function handleRedirectCallback(url) {
    return __proxy(() => auth0.handleRedirectCallback(url))
  }

  async function checkSession(options = {}) {
    return __proxy(() => auth0.checkSession(options))
  }

  // Code copied from https://github.com/auth0/auth0-vue/blob/efe1d39a0244fd072a527df97f87ab355501851d/src/plugin.ts#L144
  async function __checkSession() {
    const search = window.location.search

    try {
      if ((search.includes("code=") || search.includes("error=")) && search.includes("state=")) {
        const result = await handleRedirectCallback()
        const target = result?.appState?.target ?? "/"

        window.history.replaceState({}, "", "/")

        await router.isReady()
        router.push(target)

        return result
      } else {
        await checkSession()
      }
    } catch (error) {
      console.error("Error during __checkSession:", error)
      // __checkSession should never throw an exception as it will fail installing the plugin.
      // Instead, errors during __checkSession are propagated using the errors property on `useAuth0`.
      window.history.replaceState({}, "", "/")

      await router.isReady()
      router.push({ name: "UnauthorizedPage" })
    }
  }

  async function __refreshState() {
    state.isAuthenticated = await auth0.isAuthenticated()
    state.user = await auth0.getUser()
    state.idTokenClaims = await auth0.getIdTokenClaims()
    state.isLoading = false
  }

  async function __proxy(callback, refreshState = true) {
    let result
    try {
      result = await callback()
      state.error = null
    } catch (error) {
      state.error = error
      throw error
    } finally {
      if (refreshState) {
        await __refreshState()
      }
    }
    return result
  }

  return {
    ...toRefs(state),
    handleRedirectCallback,
  }
}

export default {
  install(Vue) {
    const auth0 = useAuth0({ initialize: true })
    Vue.prototype.$auth0 = auth0
  },
}
