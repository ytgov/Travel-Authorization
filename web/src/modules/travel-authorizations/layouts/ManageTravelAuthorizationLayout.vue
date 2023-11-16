<template>
  <div>
    <FullScreenLoadingOverlay :value="isLoadingTravelAuthorization" />

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

    <template v-if="isCachedTravelAuthorization">
      <!-- TODO: rebuild this component to accept a travel authorization id -->
      <SummaryHeaderPanel />
    </template>

    <v-tabs v-model="tab">
      <v-tab
        :to="{
          name: 'ReadMyTravelAuthorizationDetailsPage',
          params: { formId: travelAuthorizationId },
        }"
        >Details</v-tab
      >
      <v-tab
        :to="{
          name: 'ReadMyTravelAuthorizationEstimatePage',
          params: { formId: travelAuthorizationId },
        }"
        >Estimate</v-tab
      >
      <!-- TODO: add in any tabs that you can normally see in read-only mode -->
    </v-tabs>

    <template v-if="isCachedTravelAuthorization">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

import { ROLES as USER_ROLES } from "@/api/users-api"

import Breadcrumbs from "@/components/Breadcrumbs"
import FullScreenLoadingOverlay from "@/components/FullScreenLoadingOverlay"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

export default {
  name: "ManageTravelAuthorizationLayout",
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
    ...mapState("travelAuthorization", {
      travelAuthorization: "attributes",
      isLoadingTravelAuthorization: "isLoading",
      isCachedTravelAuthorization: "isCached",
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
    await this.initializeCurrentUser()
  },
  methods: {
    ...mapActions("currentUser", { initializeCurrentUser: "initialize" }),
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
