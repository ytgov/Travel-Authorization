<template>
  <div>
    <h1>QA Scenarios</h1>

    <Breadcrumbs />

    <v-card
      :loading="loading"
      class="mx-auto"
      max-width="400"
      elevation="2"
    >
      <v-card-title> Apply a given QA Scenario </v-card-title>
      <v-card-subtitle>
        The following buttons aggressively mutate database state for the purposes of QA testing.
        This means that any property on the current user could be changed or removed by clicking
        these buttons. Data might be deleted, new data might be created, existing data might be
        completely changed.
        <b>USE AT YOUR OWN RISK!</b>
      </v-card-subtitle>
      <v-list>
        <v-list-item
          v-for="scenario in scenarios"
          :key="scenario"
        >
          <v-list-item-content>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="primary"
              @click="triggerScenario(scenario)"
              >{{ scenario }}</v-btn
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs"

import scenariosApi from "@/api/qa/scenarios-api"

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
      .catch((error) => {
        this.$snack(error.message, { color: "error" })
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    triggerScenario(scenario) {
      this.loading = true
      return scenariosApi
        .create(scenario)
        .then(({ message }) => {
          this.$snack(message, { color: "success" })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
