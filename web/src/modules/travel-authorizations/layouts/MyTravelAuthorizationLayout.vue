<template>
  <PageLoader v-if="!isReadyTravelAuthorization" />
  <div v-else>
    <Breadcrumbs />

    <div class="d-flex justify-space-between align-baseline my-5">
      <h1>
        Travel -
        <VUserChipMenu :user-id="currentUser.id" />
      </h1>
    </div>

    <v-card class="default">
      <v-card-text>
        <SummaryHeaderPanel :travel-authorization-id="travelAuthorizationId" />

        <div style="border: 1px #ddd solid">
          <v-tabs>
            <DetailsTab :travel-authorization-id="travelAuthorizationId" />
            <EstimateTab :travel-authorization-id="travelAuthorizationId" />
            <ExpenseTab :travel-authorization-id="travelAuthorizationId" />
            <!-- TODO: add in any tabs that you can normally see in read-only mode -->
          </v-tabs>
        </div>

        <router-view></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import Breadcrumbs from "@/components/Breadcrumbs"
import PageLoader from "@/components/PageLoader"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

import DetailsTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/DetailsTab"
import EstimateTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/EstimateTab"
import ExpenseTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/ExpenseTab"

export default {
  name: "MyTravelAuthorizationLayout",
  components: {
    Breadcrumbs,
    DetailsTab,
    EstimateTab,
    ExpenseTab,
    PageLoader,
    SummaryHeaderPanel,
    VUserChipMenu,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("current/user", { currentUser: "attributes", isLoadingCurrentUser: "isLoading" }),
    ...mapGetters("travelAuthorization", { isReadyTravelAuthorization: "isReady" }),
  },
  async mounted() {
    await Promise.all([
      this.ensureCurrentUser(),
      this.ensureTravelAuthorization(this.travelAuthorizationId),
    ])
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
  },
}
</script>
