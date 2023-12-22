<template>
  <v-skeleton-loader
    v-if="!isReadyTravelAuthorization"
    class="mx-auto"
    max-width="300"
    type="card"
  ></v-skeleton-loader>
  <div v-else>
    <Breadcrumbs />

    <h1>
      Travel -
      <VUserChipMenu
        :user-id="currentUser.id"
        :is-current-user="true"
      />
    </h1>

    <SummaryHeaderPanel :travel-authorization-id="travelAuthorizationId" />

    <v-tabs>
      <v-tab :to="{ name: 'MyTravelAuthorizationDetailsPage', params: { travelAuthorizationId } }">
        Details
      </v-tab>
      <v-tab :to="{ name: 'MyTravelAuthorizationEstimatePage', params: { travelAuthorizationId } }">
        Estimate
      </v-tab>
      <ExpenseTab :travel-authorization-id="travelAuthorizationId" />
      <!-- TODO: add in any tabs that you can normally see in read-only mode -->
    </v-tabs>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import Breadcrumbs from "@/components/Breadcrumbs"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

import ExpenseTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/ExpenseTab"

export default {
  name: "MyTravelAuthorizationLayout",
  components: {
    Breadcrumbs,
    ExpenseTab,
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
    console.log(
      "this.isReadyTravelAuthorization:",
      JSON.stringify(this.isReadyTravelAuthorization, null, 2)
    )
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
  },
}
</script>
