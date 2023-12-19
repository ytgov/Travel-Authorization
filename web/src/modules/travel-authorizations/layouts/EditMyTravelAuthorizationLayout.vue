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
      <v-tab
        :to="{ name: 'EditMyTravelAuthorizationExpensePage', params: { travelAuthorizationId } }"
        >Expense</v-tab
      >
    </v-tabs>

    <template v-if="isReadyCurrentTravelAuthorization">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

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
    ...mapGetters("current/user", { currentUser: "attributes", isLoadingCurrentUser: "isLoading" }),
    ...mapGetters("current/travelAuthorization", {
      isReadyCurrentTravelAuthorization: "isReady",
    }),
  },
  watch: {},
  async mounted() {
    await this.ensureCurrentTravelAuthorization(this.travelAuthorizationId)
    await this.ensureCurrentUser()
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("current/travelAuthorization", {
      ensureCurrentTravelAuthorization: "ensure",
      fetchCurrentTravelAuthorizationSilently: "fetchSilently",
    }),
    // This will be unnecessary once all tabs are router links
    // This fixes a bug where the active state of the tabs is not reset, because url is not changed
    resetActiveState() {
      this.tab = this.$route.path
    },
  },
}
</script>
