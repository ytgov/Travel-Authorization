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
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      isEditable: "isEditable",
    }),
    componentName() {
      if (this.isEditable) {
        return "EditMyTravelAuthorizationEstimatePage"
      }

      return "ReadMyTravelAuthorizationEstimatePage"
    },
  },
  async mounted() {
    await Promise.all([
      await this.ensureCurrentUser(),
      await this.ensureTravelAuthorization(this.travelAuthorizationId),
    ])
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
  },
}
</script>
