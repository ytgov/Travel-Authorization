<template>
  <v-btn
    :disabled="loadingCreatingForm"
    :loading="loadingCreatingForm"
    color="primary"
    @click="createAndGoToFormDetails"
  >
    + Travel Authorization
  </v-btn>
</template>
<script>
import { mapActions, mapGetters } from "vuex"

import { ACCOMMODATION_TYPES, TRAVEL_METHODS } from "@/api/stops-api"

export default {
  name: "CreateTravelAuthorizationButton",
  data: () => ({
    loadingCreatingForm: false,
  }),
  computed: {
    ...mapGetters("currentUser", { currentUserId: "id" }),
  },
  mounted() {
    this.ensureCurrentUser()
  },
  methods: {
    ...mapActions("currentUser", { ensureCurrentUser: "initialize" }),
    ...mapActions("travelAuthorizations", ["create"]),
    goToFormDetails(form) {
      const formId = form.id
      this.$router.push({
        name: "EditMyTravelAuthorizationDetailsPage",
        params: { travelAuthorizationId: formId },
      })
    },
    createAndGoToFormDetails() {
      this.loadingCreatingForm = true
      return this.create({
        userId: this.currentUserId,
        stopsAttributes: [
          {
            accommodationType: ACCOMMODATION_TYPES.HOTEL,
            transport: TRAVEL_METHODS.AIRCRAFT,
          },
          {
            transport: TRAVEL_METHODS.AIRCRAFT,
            accommodationType: null,
          },
        ],
      })
        .then((form) => {
          return this.goToFormDetails(form)
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
        .finally(() => {
          this.loadingCreatingForm = false
        })
    },
  },
}
</script>
