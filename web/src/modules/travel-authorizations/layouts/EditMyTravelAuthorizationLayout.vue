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
        >Estimate</v-tab
      >

      <v-tooltip
        v-if="isExpenseTabDisabled"
        bottom
      >
        <template #activator="{ on }">
          <div
            class="d-flex align-center"
            v-on="on"
          >
            <v-tab
              class="d-flex align-start"
              disabled
            >
              Expense
              <v-icon
                class="ml-1"
                small
              >
                mdi-help-circle-outline
              </v-icon>
            </v-tab>
          </div>
        </template>
        <span>
          Expenses are locked until request is approved, and travel start date has passed. Locked
          reason(s):
          <ul>
            <li v-if="!isTravelAuthorizationApproved">not approved</li>
            <li v-if="!isAfterTravelStartDate">start date has not passed</li>
          </ul>
        </span>
      </v-tooltip>
      <v-tab
        v-else
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

import { STATUSES } from "@/api/travel-authorizations-api"

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
      currentTravelAuthorization: "attributes",
      isReadyCurrentTravelAuthorization: "isReady",
    }),
    isTravelAuthorizationApproved() {
      return this.currentTravelAuthorization.status === STATUSES.APPROVED
    },
    isAfterTravelStartDate() {
      const firstTravelSegment = this.currentTravelAuthorization.travelSegments[0]
      return new Date(firstTravelSegment.departureOn) < new Date()
    },
    isExpenseTabDisabled() {
      return !this.isTravelAuthorizationApproved || !this.isAfterTravelStartDate
    },
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
  },
}
</script>
