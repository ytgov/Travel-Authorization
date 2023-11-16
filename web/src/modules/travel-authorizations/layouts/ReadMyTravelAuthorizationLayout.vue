<template>
  <div>
    <FullScreenLoadingOverlay :value="loadingCurrentForm" />

    <Breadcrumbs />

    <h1 class="d-flex justify-space-between">
      <span>
        Travel -
        <VUserChipMenu
          :user-id="currentUser.id"
          :is-current-user="true"
        />
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

    <template v-if="!loadingCurrentForm">
      <SummaryHeaderPanel />
    </template>

    <v-tabs v-model="tab">
      <v-tab :to="{ name: 'ReadMyTravelAuthorizationDetailsPage', params: { formId } }"
        >Details</v-tab
      >
      <v-tab :to="{ name: 'ReadMyTravelAuthorizationEstimatePage', params: { formId } }"
        >Estimate</v-tab
      >
      <!-- TODO: add in any tabs that you can normally see in read-only mode -->
    </v-tabs>

    <template v-if="!loadingCurrentForm">
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
  name: "ReadMyTravelAuthorizationLayout",
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
    isAdmin() {
      return this.currentUser?.roles?.includes(USER_ROLES.ADMIN)
    },
  },
  mounted() {
    return Promise.all([
      this.loadCurrentTravelAuthorization(this.formId),
      this.initializeCurrentUser(),
    ])
  },
  methods: {
    ...mapActions("currentUser", { initializeCurrentUser: "initialize" }),
    ...mapActions("travelAuthorizations", ["loadCurrentTravelAuthorization"]),
    goToAdminEditPage() {
      alert(`TODO: redirect user to admin edit interface for TravelAuthorization#${this.formId}`)
    },
  },
}
</script>
