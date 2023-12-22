<template>
  <div>
    <FullScreenLoadingOverlay :value="!isReadyCurrentTravelAuthorization" />

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

    <template v-if="isReadyCurrentTravelAuthorization">
      <SummaryHeaderPanel :travel-authorization-id="formId" />
    </template>

    <v-tabs v-model="tab">
      <v-tab :to="{ name: 'ReadMyTravelAuthorizationDetailsPage', params: { formId } }"
        >Details</v-tab
      >
      <v-tab :to="{ name: 'ReadMyTravelAuthorizationEstimatePage', params: { formId } }"
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
      >
        Expense
      </v-tab>
      <!-- TODO: add in any tabs that you can normally see in read-only mode -->
    </v-tabs>

    <template v-if="isReadyCurrentTravelAuthorization">
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { isNil } from "lodash"

import { ROLES as USER_ROLES } from "@/api/users-api"
import { STATUSES } from "@/api/travel-authorizations-api"

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
    travelAuthorizationId() {
      return this.formId
    },
    isAdmin() {
      return this.currentUser?.roles?.includes(USER_ROLES.ADMIN)
    },
    isTravelAuthorizationApproved() {
      return this.currentTravelAuthorization.status === STATUSES.APPROVED
    },
    isAfterTravelStartDate() {
      const firstTravelSegment = this.currentTravelAuthorization.travelSegments[0]
      if (isNil(firstTravelSegment)) return false

      return new Date(firstTravelSegment.departureOn) < new Date()
    },
    isExpenseTabDisabled() {
      return !this.isTravelAuthorizationApproved || !this.isAfterTravelStartDate
    },
  },
  mounted() {
    return Promise.all([
      this.ensureCurrentTravelAuthorization(this.formId),
      this.ensureCurrentUser(),
    ])
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("current/travelAuthorization", { ensureCurrentTravelAuthorization: "ensure" }),
    goToAdminEditPage() {
      alert(`TODO: redirect user to admin edit interface for TravelAuthorization#${this.formId}`)
    },
  },
}
</script>
