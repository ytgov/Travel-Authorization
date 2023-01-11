<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <h3>Please use your YNET credentials to sign in</h3>
    <p>
      The authentication for this application is managed by an authentication
      partner. When you click the button below, you will be redirected to their
      site and once authenticated, back here.
    </p>
    <p>
      If you have already authenticated and your session is still active, it may
      skip the sign in process and return you here immediately.
    </p>
    <div v-if="!$auth.loading">
      <a class="v-btn primary v-size--default" @click="login"
        >Click here to sign in</a
      >
    </div>
  </div>
</template>

<script>
import * as config from "../config";

export default {
  name: "Login",
  data: () => ({
    title: `Welcome to ${config.applicationName}`
  }),
  async created() {},
  async mounted() {},
  methods: {
    async login() {
      this.$auth.loginWithRedirect({
        appState: { targetUrl: "/dashboard" }
      });
    }
  }
};
</script>
