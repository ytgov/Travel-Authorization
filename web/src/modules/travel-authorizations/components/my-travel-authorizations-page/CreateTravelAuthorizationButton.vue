<template>
  <v-btn
    :disabled="isLoadingTravelAuthorization"
    :loading="isLoadingTravelAuthorization"
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
  data: () => ({}),
  computed: {
    ...mapGetters("current/user", { currentUserId: "id" }),
    ...mapGetters("current/travelAuthorization", { isLoadingTravelAuthorization: "isLoading" }),
  },
  mounted() {
    this.ensureCurrentUser()
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("current/travelAuthorization", ["create"]),
    goToFormDetails(form) {
      const formId = form.id
      this.$router.push({
        name: "EditMyTravelAuthorizationDetailsPage",
        params: { travelAuthorizationId: formId },
      })
    },
    createAndGoToFormDetails() {
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
    },
  },
}
</script>
