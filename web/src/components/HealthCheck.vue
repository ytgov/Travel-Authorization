<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card
            outlined
            class="pa-3 mb-4"
          >
            <v-card-title
              >Health Check
              <v-btn
                class="ma-0 ml-1"
                icon
                color="green"
                title="refresh"
                @click="refresh"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </v-card-title>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>API Port: {{ appHealth.apiPort }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Frontend Url: {{ appHealth.frontendUrl }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Build Env: {{ appHealth.nodeEnd }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-card
            outlined
            class="pa-3 mb-4"
          >
            <v-card-title
              >DB Connection Information
              <v-btn
                class="ma-0 ml-1"
                icon
                color="green"
                title="refresh"
                @click="refresh"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </v-card-title>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>Host: {{ dbHealth.connection }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Database: {{ dbHealth.database }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>User: {{ dbHealth.user }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Port: {{ dbHealth.port }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card
            outlined
            class="pa-3"
          >
            <v-card-title
              >Environment Information
              <v-btn
                class="ma-0 ml-1"
                icon
                color="green"
                title="refresh"
                @click="refresh"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </v-card-title>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>Release Tag: {{ environment.releaseTag }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content
                  >Git Commit Hash: {{ environment.gitCommitHash }}</v-list-item-content
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import http from "@/apis/http-client"

export default {
  data: () => ({
    healthCheck: {
      appHealth: {},
      dbHealth: {},
      environment: {},
    },
  }),
  computed: {
    dbHealth() {
      return this.healthCheck.dbHealth || {}
    },
    appHealth() {
      return this.healthCheck.appHealth || {}
    },
    environment() {
      return this.healthCheck.environment || {}
    },
  },
  async mounted() {
    await this.refresh()
  },
  methods: {
    refresh() {
      return http.get("/api/health-check").then(({ data }) => {
        this.$set(this, "healthCheck", data)
        console.log("this.healthCheck:", JSON.stringify(this.healthCheck, null, 2))
      }).catch((error) => {
        this.$snack(`Failed to fetch health check data: ${error}`, { color: "error" });
      })
    },
  },
}
</script>
