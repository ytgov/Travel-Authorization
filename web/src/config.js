export const APPLICATION_NAME = "Travel Authorization"
export const ENVIRONMENT = process.env.NODE_ENV
export const RELEASE_TAG = process.env.VUE_APP_RELEASE_TAG
export const GIT_COMMIT_HASH = process.env.VUE_APP_GIT_COMMIT_HASH

export const HAS_SIDEBAR = true // TODO: consider removing this
export const HAS_SIDEBAR_CLOSABLE = false // TODO: consider removing this

const dynamicConfigs = {
  development: {
    API_BASE_URL: "http://localhost:3000",
    AUTH0_DOMAIN: "https://dev-0tc6bn14.eu.auth0.com",
    AUTH0_CLIENT_ID: "ZHjPOeCwYBov6eR1lxGOVYhYi4VPV8eU",
    AUTH0_AUDIENCE: "testing",
  },
  production: {
    API_BASE_URL: window.location.origin,
    AUTH0_DOMAIN: "https://yukon.eu.auth0.com",
    AUTH0_CLIENT_ID: "kbp3mBBVji9nIJUvLbq13ypfWZnUbU5j",
    AUTH0_AUDIENCE: "generic-production",
  },
  local_production: {
    API_BASE_URL: window.location.origin,
    AUTH0_DOMAIN: "https://dev-0tc6bn14.eu.auth0.com",
    AUTH0_CLIENT_ID: "ZHjPOeCwYBov6eR1lxGOVYhYi4VPV8eU",
    AUTH0_AUDIENCE: "testing",
  },
}

const isRunningProductionBuildLocally =
  ENVIRONMENT === "production" && window.location.host == "localhost:8080"

const effectiveEnvironment = isRunningProductionBuildLocally ? "local_production" : ENVIRONMENT

if (!(effectiveEnvironment in dynamicConfigs)) {
  throw new Error(`Invalid effective environment: ${effectiveEnvironment}`)
}

const dynamicConfig = dynamicConfigs[effectiveEnvironment]

export const { API_BASE_URL, AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } = dynamicConfig
