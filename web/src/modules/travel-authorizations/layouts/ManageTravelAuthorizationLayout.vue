<template>
  <v-layout
    v-if="!isReadyTravelAuthorization"
    fill-height
    align-center
    justify-center
    class="min-vh-70"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
  </v-layout>
  <div v-else>
    <Breadcrumbs />

    <h1 class="d-flex justify-space-between">
      <span>
        Travel -
        <VUserChipMenu :user-id="travelAuthorizationUser.id" />
      </span>
      <v-btn
        v-if="isAdmin"
        color="primary"
        @click="goToAdminEditPage"
      >
        Edit
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              small
              class="ml-2"
              v-bind="attrs"
              v-on="on"
            >
              mdi-help-circle-outline
            </v-icon>
          </template>
          <span>You can edit this because you are an admin.</span>
        </v-tooltip>
      </v-btn>
    </h1>

    <SummaryHeaderPanel :travel-authorization-id="travelAuthorizationId" />

    <v-tabs>
      <DetailsTab :travel-authorization-id="travelAuthorizationId" />
      <EstimateTab :travel-authorization-id="travelAuthorizationId" />
      <ExpenseTab :travel-authorization-id="travelAuthorizationId" />
      <!-- TODO: add in any tabs that you can normally see in manage mode -->
    </v-tabs>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import { ROLES as USER_ROLES } from "@/api/users-api"

import Breadcrumbs from "@/components/Breadcrumbs"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

import DetailsTab from "@/modules/travel-authorizations/components/manage-travel-authorization-layout/DetailsTab"
import EstimateTab from "@/modules/travel-authorizations/components/manage-travel-authorization-layout/EstimateTab"
import ExpenseTab from "@/modules/travel-authorizations/components/manage-travel-authorization-layout/ExpenseTab"

export default {
  name: "ManageTravelAuthorizationLayout",
  components: {
    Breadcrumbs,
    SummaryHeaderPanel,
    VUserChipMenu,
    DetailsTab,
    EstimateTab,
    ExpenseTab,
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
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      isLoadingTravelAuthorization: "isLoading",
      isReadyTravelAuthorization: "isReady",
    }),
    travelAuthorizationUser() {
      return this.travelAuthorization.user
    },
    isAdmin() {
      return this.currentUser?.roles?.includes(USER_ROLES.ADMIN)
    },
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
    await this.ensureCurrentUser()
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorization", {
      ensureTravelAuthorization: "ensure",
    }),
    goToAdminEditPage() {
      alert(
        `TODO: redirect user to admin edit interface for TravelAuthorization#${this.travelAuthorizationId}`
      )
    },
  },
}
</script>
