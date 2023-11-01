<template>
  <div>
    <FullScreenLoadingOverlay :value="loadingCurrentForm" />

    <Breadcrumbs />

    <h1>
      Travel -
      <v-progress-circular
        v-if="loadingCurrentUser"
        indeterminate
      ></v-progress-circular>
      <template v-else> {{ currentUser.firstName }} {{ currentUser.lastName }} </template>
    </h1>

    <template v-if="!loadingCurrentForm">
      <SummaryHeaderPanel />
    </template>

    <v-tabs v-model="tab">
      <v-tab :to="{ name: 'TravelAuthorizationRead-DetailsTab', params: { formId } }"
        >Details</v-tab
      >
      <v-tab
        :to="{ name: 'TravelAuthorizationRead-EstimateTab', params: { formId } }"
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

    <div class="d-flex justify-end">
      <v-btn
        color="secondary"
        :to="{ name: 'TravelFormList' }"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

import Breadcrumbs from "@/components/Breadcrumbs"
import FullScreenLoadingOverlay from "@/components/FullScreenLoadingOverlay"
import SummaryHeaderPanel from "./travel-authorization-read/SummaryHeaderPanel"

export default {
  name: "TravelAuthorizationRead",
  components: {
    Breadcrumbs,
    FullScreenLoadingOverlay,
    SummaryHeaderPanel,
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
    ...mapState("travelForm", [
      "currentForm",
      "currentUser",
      "loadingCurrentForm",
      "loadingCurrentUser",
    ]),
  },
  mounted() {
    return Promise.all([this.loadAsCurrentForm(this.formId), this.loadCurrentUser()])
  },
  methods: {
    ...mapActions("travelForm", ["loadAsCurrentForm", "loadCurrentUser"]),
    // This will be unnecessary once all tabs are router links
    // This fixes a bug where the active state of the tabs is not reset, because url is not changed
    resetActiveState() {
      this.tab = this.$route.path
    },
  },
}
</script>
