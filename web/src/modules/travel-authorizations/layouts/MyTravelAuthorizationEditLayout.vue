<template>
  <div>
    <FullScreenLoadingOverlay :value="loadingCurrentForm" />

    <Breadcrumbs />

    <h1>
      Travel -
      <VUserChipMenu
        :user-id="currentUser.id"
        :is-current-user="true"
      />
    </h1>

    <template v-if="!loadingCurrentForm">
      <SummaryHeaderPanel />
    </template>

    <v-tabs v-model="tab">
      <v-tab :to="{ name: 'MyTravelAuthorizationEditDetailsPage', params: { formId } }"
        >Details</v-tab
      >
      <v-tab
        :to="{ name: 'MyTravelAuthorizationEditEstimatePage', params: { formId } }"
        @click="resetActiveState"
        >Estimate</v-tab
      >
      <v-tab>Request - TODO</v-tab>
      <v-tab>Itinerary - TODO</v-tab>
      <v-tab>Expense - TODO</v-tab>
      <v-tab>Reporting - TODO</v-tab>
    </v-tabs>

    <template v-if="!loadingCurrentForm">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

import Breadcrumbs from "@/components/Breadcrumbs"
import FullScreenLoadingOverlay from "@/components/FullScreenLoadingOverlay"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

export default {
  name: "MyTravelAuthorizationEditLayout",
  components: {
    Breadcrumbs,
    FullScreenLoadingOverlay,
    SummaryHeaderPanel,
    VUserChipMenu,
  },
  props: {
    formId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    ...mapState("currentUser", { currentUser: "attributes", isLoadingCurrentUser: "isLoading" }),
    ...mapState("travelAuthorizations", ["loadingCurrentForm"]),
  },
  watch: {
    // Hacky thing to refresh travel authorization after user edits the estimates in the Estimate tab.
    // This does a wizard of oz style, silent, background refresh.
    $route(to) {
      if (to.name === "MyTravelAuthorizationEditDetailsPage") {
        this.loadCurrentTravelAuthorizationSilently(this.formId)
      }
    },
  },
  async mounted() {
    await this.loadCurrentTravelAuthorization(this.formId)
    await this.initializeCurrentUser()
  },
  methods: {
    ...mapActions("currentUser", { initializeCurrentUser: "initialize" }),
    ...mapActions("travelAuthorizations", [
      "loadCurrentTravelAuthorization",
      "loadCurrentTravelAuthorizationSilently",
    ]),
    // This will be unnecessary once all tabs are router links
    // This fixes a bug where the active state of the tabs is not reset, because url is not changed
    resetActiveState() {
      this.tab = this.$route.path
    },
  },
}
</script>
