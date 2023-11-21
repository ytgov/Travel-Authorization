<template>
  <v-card elevation="2">
    <v-card-title> Management</v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn
            color="success"
            @click="approve"
          >
            Approve
          </v-btn>
          <v-btn
            class="ml-2"
            color="error"
            @click="deny"
          >
            Deny
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import travelAuthorizationApi from "@/api/travel-authorizations-api"

export default {
  name: "ManagementCard",
  components: {},
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters("current/travelAuthorization", {
      currentTravelAuthorization: "attributes",
    }),
  },
  async mounted() {
    await this.ensureCurrentTravelAuthorization(this.travelAuthorizationId)
  },
  methods: {
    ...mapActions("current/travelAuthorization", { ensureCurrentTravelAuthorization: "ensure" }),
    // TODO: move this to a store action
    approve() {
      return travelAuthorizationApi
        .approve(this.currentTravelAuthorization.id)
        .then(() => {
          this.$snack("Travel authorization approved!", { color: "success" })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
    deny() {
      return travelAuthorizationApi
        .deny(this.currentTravelAuthorization.id)
        .then(() => {
          this.$snack("Travel authorization denied.", { color: "success" })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
  },
}
</script>
