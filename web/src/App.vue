<template>
  <v-app>
    <router-view v-if="isUnauthenticatedRoute" />
    <router-view v-else-if="isReady" />
    <PageLoader
      v-else
      message="Checking authentication status ..."
    />
  </v-app>
</template>

<script setup>
import { computed, ref } from "vue"
import { useRoute } from "vue2-helpers/vue-router"

import auth0 from "@/plugins/auth0-plugin"

import PageLoader from "@/components/PageLoader.vue"

// TODO: consider moving this to a route guard?
const route = useRoute()
const isUnauthenticatedRoute = computed(() => route.meta.requiresAuth === false)

const isLoading = ref(false)
const isReady = computed(() => !isLoading.value)

// // Check if the user is authenticated when the app loads
// // Bounces user to login page if they aren't authenticated
// ;(async () => {
//   try {
//     await auth0.getTokenSilently()
//   } catch (error) {
//     if (error.error !== "login_required") {
//       throw error
//     }
//   }
// })()

;(async () => {
  isLoading.value = true
  try {
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
      const { appState } = await auth0.handleRedirectCallback()

      if (appState && appState.targetUrl) {
        appState.targetUrl
        console.log("appState.targetUrl:", appState.targetUrl)
      }

      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Don't bother attempting to load current user for unathenticated routes
    if (isUnauthenticatedRoute.value) return

    const isAuthenticated = await auth0.isAuthenticated()
    console.log("isAuthenticated:", isAuthenticated)

    // logged in. you can get the user profile like this:
    const user = await auth0.getUser()
    console.log(user)
  } catch (error) {
    console.log("error:", error)
  } finally {
    isLoading.value = false
  }
})()
</script>
