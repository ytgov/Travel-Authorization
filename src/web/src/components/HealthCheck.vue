<template>
  <v-app>
    Health Check
    <br />
    API Port:
    {{ healthCheck.appHealth.ApiPort }}
    <br />
    Frontend Url:
    {{ healthCheck.appHealth.FrontendUrl }}
    <br />
    Build Env:
    {{ healthCheck.appHealth.NodeEnd }}
    <br />
    <br />
    DB Connection Information
    <br />
    Host:
    {{ healthCheck.dbHealth.Connection }}
    <br />
    Database:
    {{ healthCheck.dbHealth.Database }}
    <br />
    User:
    {{ healthCheck.dbHealth.User }}
    <br />
    Port:
    {{ healthCheck.dbHealth.Port }}
  </v-app>
</template>
<script>
import { HEALTH_URL } from "../urls";
import { secureGet } from "@/store/jwt";

export default {
  data: () => ({
    healthCheck: {}
  }),
  created() {
    secureGet(`${HEALTH_URL}`).then(resp => {
      this.healthCheck = resp.data;
    });
  },
  methods: {}
};
</script>
