<template>
  <v-app>
    <router-view v-if="isUnauthenticatedRoute" />
    <router-view v-else-if="isReadyAuth0 || isErrored" />
    <PageLoader
      v-else-if="isAuthenticated && isLoadingCurrentUser"
      message="Fetching and syncing user"
    />
    <PageLoader
      v-else-if="isAuthenticatingAuth0"
      message="Checking authentication status ..."
    />
    <PageLoader
      v-else
      message="Initializing app ..."
    />
  </v-app>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

import auth0 from "@/plugins/auth0-plugin"
import useCurrentUser from "@/use/use-current-user"
import PageLoader from "@/components/PageLoader.vue"

const route = useRoute()
const router = useRouter()

const isUnauthenticatedRoute = computed(() => route.meta.requiresAuth === false)
const isHandlingRedirectCallback = ref(false)
const isAuthenticatingAuth0 = ref(false)
const isAuthenticated = ref(false)
const isErrored = ref(false)
const isReadyAuth0 = computed(
  () => !isHandlingRedirectCallback.value && !isAuthenticatingAuth0.value && isAuthenticated.value
)

const { fetch, isLoading: isLoadingCurrentUser } = useCurrentUser({ eager: false })

window.addEventListener("load", async () => {
  await handleAuth0RedirectCallback()
})

watch(
  () => isReadyAuth0.value,
  async (newIsReadyAuth0) => {
    // Don't bother attempting to load current user for unathenticated routes
    if (isUnauthenticatedRoute.value) return

    if (newIsReadyAuth0 === true) {
      await authorizeCurrentUser()
    }
  },
  { immediate: true }
)

async function handleAuth0RedirectCallback() {
  try {
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
      isHandlingRedirectCallback.value = true
      const { appState } = await auth0.handleRedirectCallback()

      if (appState && appState.targetUrl) {
        window.history.replaceState({}, document.title, appState.targetUrl)
      } else {
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      await assertAuth0IsAuthenticated()
    }
  } catch (error) {
    console.log("Failed to handle Auth0 callback:", error)
  } finally {
    isHandlingRedirectCallback.value = false
  }
}

async function assertAuth0IsAuthenticated() {
  isAuthenticatingAuth0.value = true
  try {
    isAuthenticated.value = await auth0.isAuthenticated()
    // This will occur when user attempts deep navigation to a protected route
    // If user is not authenticated they will be redirect to login page
    // And after login, redirected to the route they were trying to reach.
    if (isAuthenticated.value === false) {
      return auth0.loginWithRedirect({ appState: { targetUrl: window.location.pathname } })
    }
  } catch (error) {
    console.error("Error checking authentication status:", error)
    isErrored.value = true
    await router.isReady()
    await router.push({ name: "UnauthorizedPage" })
  } finally {
    isAuthenticatingAuth0.value = false
  }
}

async function authorizeCurrentUser() {
  try {
    await fetch()
    isErrored.value = false
  } catch (error) {
    console.error("Error fetching current user:", error)
    isErrored.value = true
    await router.isReady()
    await router.push({ name: "UnauthorizedPage" })
  }
}
</script>
