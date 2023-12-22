<template>
  <v-tab
    :to="{
      name: componentName,
      params: { travelAuthorizationId },
    }"
  >
    Estimate
  </v-tab>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { STATUSES } from "@/api/travel-authorizations-api"

export default {
  name: "EstimateTab",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("current/user", { currentUser: "attributes" }),
    ...mapGetters("travelAuthorization", { travelAuthorization: "attributes" }),
    componentName() {
      if (this.isEditable) {
        return "EditMyTravelAuthorizationEstimatePage"
      }

      return "ReadMyTravelAuthorizationEstimatePage"
    },
    // TODO: probably load from back-end policy in the future to avoid duplication of complex logic
    isEditable() {
      if (
        this.travelAuthorization.userId === this.currentUser.id &&
        this.travelAuthorization.status === STATUSES.DRAFT
      ) {
        return true
      }
      return false
    },
  },
  async mounted() {
    await Promise.all([
      await this.ensureCurrentUser(),
      await this.ensureTravelAuthorization(this.travelAuthorizationId),
    ])

    if (this.isEditable && this.$route.name !== "EditMyTravelAuthorizationEstimatePage") {
      this.$router.push({
        name: "EditMyTravelAuthorizationEstimatePage",
        params: { travelAuthorizationId: this.travelAuthorizationId },
      })
    }
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
  },
}
</script>
