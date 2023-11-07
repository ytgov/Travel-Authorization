<template>
  <v-overlay>
    <div class="text-center">
      <v-progress-circular
        indeterminate
        size="64"
        class="mb-5"
      ></v-progress-circular>
      <h1 class="title">{{ title }}</h1>
    </div>
  </v-overlay>
</template>

<script>
import { applicationName } from "@/config"
import { getInstance } from "@/auth"

export default {
  name: "AuthLoadingOverlay",
  data: () => ({
    title: `Loading ${applicationName}`,
  }),
  computed: {
    authService() {
      return getInstance()
    },
  },
  watch: {
    "authService.isAuthenticated"(newValue) {
      if (newValue === true) {
        this.performPostAuthenticationRedirect()
      }
    },
    "authService.isLoading"(newValue) {
      if (newValue === false && this.authService.isAuthenticated === false) {
        this.performRedirectToSignIn()
      }
    },
  },
  async mounted() {
    if (this.authService.isLoading === false && this.authService.isAuthenticated === false) {
      this.performRedirectToSignIn()
    } else if (this.authService.isAuthenticated === true) {
      this.performPostAuthenticationRedirect()
    }
  },
  methods: {
    performPostAuthenticationRedirect() {
      const targetUrl = this.authService.targetUrl || "/dashboard"
      this.$router.push(targetUrl)
    },
    performRedirectToSignIn() {
      this.$router.push("/sign-in")
    },
  },
}
</script>
