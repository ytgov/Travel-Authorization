<template>
  <v-app>
    <router-view v-if="isUnauthenticatedRoute" />
    <router-view v-else-if="isReady || isErrored" />
    <PageLoader
      v-else-if="isAuthenticated"
      message="Fetching and syncing user"
    />
    <PageLoader
      v-else
      message="Checking authentication status ..."
    />
  </v-app>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

import auth0 from "@/plugins/auth0-plugin"
import useCurrentUser from "@/use/use-current-user"
import PageLoader from "@/components/PageLoader.vue"

// TODO: consider moving this to a route guard?
const route = useRoute()
const router = useRouter()
const isUnauthenticatedRoute = computed(() => route.meta.requiresAuth === false)

const isAuthenticated = ref(false)
const isLoading = ref(false)
const isErrored = ref(false)
const isReady = computed(() => !isLoading.value && isAuthenticated.value)

const { fetch } = useCurrentUser({ eager: false })

async function performLoginFlow() {
  isLoading.value = true
  try {
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
      const { appState } = await auth0.handleRedirectCallback()

      if (appState && appState.targetUrl) {
        appState.targetUrl
        router.replace(appState.targetUrl)
      }

      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Don't bother attempting to load current user for unathenticated routes
    if (isUnauthenticatedRoute.value) return

    isAuthenticated.value = await auth0.isAuthenticated()
    if (isAuthenticated.value === false) {
      return auth0.loginWithRedirect()
    }

    try {
      await fetch()
      isErrored.value = false
    } catch (error) {
      console.error("Error fetching current user:", error)
      console.log("Failed to load current user:", error)
      isErrored.value = true
      router.push({ name: "SignInPage" })
    }
  } catch (error) {
    console.log("error:", error)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  await performLoginFlow()
})
</script>
