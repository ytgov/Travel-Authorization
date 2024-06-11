export const applicationName = "Travel Authorization"
export const applicationIcon = "mdi-cash-register"
export const hasSidebar = true
export const hasSidebarClosable = false

export const environment = process.env.NODE_ENV
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000"
export const releaseTag = process.env.VUE_APP_RELEASE_TAG
export const gitCommitHash = process.env.VUE_APP_GIT_COMMIT_HASH
