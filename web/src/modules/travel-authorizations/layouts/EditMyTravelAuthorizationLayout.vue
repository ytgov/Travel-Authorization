<template>
  <div>
    <FullScreenLoadingOverlay :value="!isReadyCurrentTravelAuthorization" />

    <Breadcrumbs />

    <h1>
      Travel -
      <VUserChipMenu
        :user-id="currentUser.id"
        :is-current-user="true"
      />
    </h1>

    <template v-if="isReadyCurrentTravelAuthorization">
      <SummaryHeaderPanel :travel-authorization-id="travelAuthorizationId" />
    </template>

    <v-tabs v-model="tab">
      <v-tab
        :to="{ name: 'EditMyTravelAuthorizationDetailsPage', params: { travelAuthorizationId } }"
        >Details</v-tab
      >
      <v-tab
        :to="{ name: 'EditMyTravelAuthorizationEstimatePage', params: { travelAuthorizationId } }"
        @click="resetActiveState"
        >Estimate</v-tab
      >
      <v-tab>Request - TODO</v-tab>
      <v-tab>Itinerary - TODO</v-tab>
      <v-tab>Expense - TODO</v-tab>
      <v-tab>Reporting - TODO</v-tab>
    </v-tabs>

    <template v-if="isReadyCurrentTravelAuthorization">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"

import Breadcrumbs from "@/components/Breadcrumbs"
import FullScreenLoadingOverlay from "@/components/FullScreenLoadingOverlay"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

export default {
  name: "EditMyTravelAuthorizationLayout",
  components: {
    Breadcrumbs,
    FullScreenLoadingOverlay,
    SummaryHeaderPanel,
    VUserChipMenu,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    ...mapState("currentUser", { currentUser: "attributes", isLoadingCurrentUser: "isLoading" }),
    ...mapGetters("current/travelAuthorization", {
      isReadyCurrentTravelAuthorization: "isReady",
      stops: "stops",
      firstStop: "firstStop",
      lastStop: "lastStop",
    }),
  },
  watch: {
    // Hacky thing to refresh travel authorization after user edits the estimates in the Estimate tab.
    // This does a wizard of oz style, silent, background refresh.
    $route(to) {
      if (to.name === "EditMyTravelAuthorizationDetailsPage") {
        this.fetchCurrentTravelAuthorizationSilently(this.travelAuthorizationId)
      }
    },
  },
  async mounted() {
    await this.ensureCurrentTravelAuthorization(this.travelAuthorizationId)
    await this.initializeCurrentUser()
    await this.ensureMinimalStopCount()
  },
  methods: {
    ...mapActions("currentUser", { initializeCurrentUser: "initialize" }),
    ...mapActions("current/travelAuthorization", {
      ensureCurrentTravelAuthorization: "ensure",
      fetchCurrentTravelAuthorizationSilently: "fetchSilently",
      newBlankStop: "newBlankStop",
      replaceStops: "replaceStops",
    }),
    async ensureMinimalStopCount() {
      const updatedFirstStop = await this.newBlankStop({
        ...this.firstStop,
      })
      const updatedLastStop = await this.newBlankStop({
        ...this.lastStop,
      })
      await this.replaceStops([updatedFirstStop, ...this.stops.slice(1, -1), updatedLastStop])
    },
    // This will be unnecessary once all tabs are router links
    // This fixes a bug where the active state of the tabs is not reset, because url is not changed
    resetActiveState() {
      this.tab = this.$route.path
    },
  },
}
</script>
