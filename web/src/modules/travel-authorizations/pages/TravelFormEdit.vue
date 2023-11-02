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
      <SummaryHeaderForm />
    </template>

    <v-tabs v-model="tab">
      <v-tab :to="{ name: 'TravelFormEdit-DetailsTab', params: { formId } }">Details</v-tab>
      <v-tab
        :to="{ name: 'TravelFormEdit-EstimateTab', params: { formId } }"
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
import SummaryHeaderForm from "./travel-form-edit/SummaryHeaderForm"

export default {
  name: "TravelFormEdit",
  components: {
    Breadcrumbs,
    FullScreenLoadingOverlay,
    SummaryHeaderForm,
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
    ...mapState("travelAuthorizations", ["currentUser", "loadingCurrentForm", "loadingCurrentUser"]),
  },
  mounted() {
    return Promise.all([this.loadAsCurrentTravelAuthorization(this.formId), this.loadCurrentUser()])
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadAsCurrentTravelAuthorization", "loadCurrentUser"]),
    // This will be unnecessary once all tabs are router links
    // This fixes a bug where the active state of the tabs is not reset, because url is not changed
    resetActiveState() {
      this.tab = this.$route.path
    },
  },
}
</script>
