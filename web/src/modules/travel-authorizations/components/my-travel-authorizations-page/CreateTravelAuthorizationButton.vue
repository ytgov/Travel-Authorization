<template>
  <v-btn
    :disabled="isLoadingTravelAuthorization"
    :loading="isLoadingTravelAuthorization"
    class="my-0"
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
    ...mapGetters("travelAuthorization", { isLoadingTravelAuthorization: "isLoading" }),
  },
  mounted() {
    this.ensureCurrentUser()
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorization", ["create"]),
    goToFormDetails(travelAuthorization) {
      const travelAuthorizationId = travelAuthorization.id
      this.$router.push({
        name: "EditMyTravelAuthorizationDetailsPage",
        params: { travelAuthorizationId },
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
