<template>
  <v-card elevation="2">
    <v-card-title> Management</v-card-title>
    <v-card-text>
      <!-- TODO: add support for re-assignment to another supervisor -->
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
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
    }),
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
  },
  methods: {
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
    // TODO: move this to a store action
    approve() {
      return travelAuthorizationApi
        .approve(this.travelAuthorization.id)
        .then(() => {
          this.$snack("Travel authorization approved!", { color: "success" })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
    deny() {
      return travelAuthorizationApi
        .deny(this.travelAuthorization.id)
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
