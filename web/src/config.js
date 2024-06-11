export const APPLICATION_NAME = "Travel Authorization"
export const HAS_SIDEBAR = true
export const HAS_SIDEBAR_CLOSABLE = false

export const ENVIRONMENT = process.env.NODE_ENV
export const API_BASE_URL = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000"
export const RELEASE_TAG = process.env.VUE_APP_RELEASE_TAG
export const GIT_COMMIT_HASH = process.env.VUE_APP_GIT_COMMIT_HASH
