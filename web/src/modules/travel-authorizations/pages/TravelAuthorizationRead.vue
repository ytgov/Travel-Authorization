<template>
  <div>
    <FullScreenLoadingOverlay :value="loadingCurrentForm" />

    <Breadcrumbs />

    <h1 class="d-flex justify-space-between mb-0">
      <span>
        Travel -
        <v-progress-circular
          v-if="loadingCurrentUser"
          indeterminate
        ></v-progress-circular>
        <template v-else> {{ currentUser.firstName }} {{ currentUser.lastName }} </template>
      </span>
      <v-btn
        v-if="isAdmin"
        color="primary"
        @click="goToAdminEditPage"
      >
        Edit
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
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
      <v-tab :to="{ name: 'TravelAuthorizationRead-DetailsTab', params: { formId } }"
        >Details</v-tab
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

import { User } from "@/constants"

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
    ...mapState("travelAuthorizations", ["currentUser", "loadingCurrentForm", "loadingCurrentUser"]),
    isAdmin() {
      return this.currentUser?.roles?.includes(User.Roles.ADMIN)
    },
  },
  mounted() {
    return Promise.all([this.loadCurrentTravelAuthorization(this.formId), this.loadCurrentUser()])
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadCurrentTravelAuthorization", "loadCurrentUser"]),
    goToAdminEditPage() {
      alert(`TODO: redirect user to admin edit interface for TravelAuthorization#${this.formId}`)
    },
  },
}
</script>
