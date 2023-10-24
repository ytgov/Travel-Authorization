<template>
  <div>
    <h1>QA Scenarios</h1>

    <Breadcrumbs />

    <v-card
      class="mx-auto"
      max-width="400"
      tile
    >
      <v-list>
        <v-list-item
          v-for="scenario in scenarios"
          :key="scenario"
        >
          <v-list-item-content>
            <v-btn @click="triggerScenario(scenario)">{{ scenario }}</v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs"

import http from "@/apis/http-client"
import scenariosApi from "@/apis/qa/scenarios-api"

export default {
  name: "Scenarios",
  components: {
    Breadcrumbs,
  },
  data() {
    return {
      scenarios: [],
      loading: true,
    }
  },
  async mounted() {
    this.loading = true
    await scenariosApi
      .list()
      .then(({ scenarios }) => {
        this.scenarios = scenarios
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    triggerScenario(scenario) {
      return http.post(`/api/qa/${scenario}`).then(() => {})
    },
  },
}
</script>
