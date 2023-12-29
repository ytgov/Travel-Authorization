<template>
  <v-card elevation="2">
    <v-card-title> Approvals </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <EstimatedCostTextField :estimates="travelAuthorizationEstimates" />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-btn
              v-if="!refreshingEstimatesSilently && hasEstimates"
              :to="{
                name: 'EditMyTravelAuthorizationEstimatePage',
                params: { travelAuthorizationId: travelAuthorizationId },
              }"
              class="mt-1"
              color="secondary"
              >Edit Estimate</v-btn
            >
            <EstimateGenerateDialog
              v-else
              :travel-authorization-id="travelAuthorizationId"
              button-classes="mt-1"
              button-color="primary"
              @created="refreshEstimatesSilently"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <v-text-field
              v-model="travelAdvanceInDollars"
              :rules="[required, isInteger]"
              label="Travel Advance"
              prefix="$"
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="travelAuthorization.preappId"
              :items="preApprovedTravelRequests"
              :loading="isLoadingCurrentUser || loadingPreApprovedTravelRequests"
              label="Pre-approved Travel Request?"
              no-data-text="No pre-approvals available"
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
            <SearchableUserEmailCombobox
              v-model="travelAuthorization.supervisorEmail"
              :rules="[required]"
              label="Submit to"
              dense
              outlined
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <SubmitToSupervisorButton
              :travel-authorization-id="travelAuthorizationId"
              :validate-form="validateForm"
              class="mt-1"
            />
          </v-col>
        </v-row>
      </v-form>

      <v-row>
        <v-col>
          <TravelAuthorizationActionLogsTable :travel-authorization-id="travelAuthorization.id" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { isEmpty } from "lodash"
import { mapActions, mapGetters } from "vuex"

import preApprovedTravelRequestsApi from "@/api/pre-approved-travel-requests-api"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"
import EstimatedCostTextField from "@/modules/travel-authorizations/components/EstimatedCostTextField"
import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable"

import EstimateGenerateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/approvals-form-card/EstimateGenerateDialog"
import SubmitToSupervisorButton from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/approvals-form-card/SubmitToSupervisorButton"

export default {
  name: "ApprovalsFormCard",
  components: {
    EstimatedCostTextField,
    EstimateGenerateDialog,
    SearchableUserEmailCombobox,
    SubmitToSupervisorButton,
    TravelAuthorizationActionLogsTable,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
    validateForm: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    required: (v) => !!v || "This field is required",
    isInteger: (v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number",
    preApprovedTravelRequests: [],
    loadingPreApprovedTravelRequests: false,
    refreshingEstimatesSilently: false,
  }),
  computed: {
    ...mapGetters("current/user", { currentUser: "attributes", isLoadingCurrentUser: "isLoading" }),
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      travelAuthorizationEstimates: "estimates",
    }),
    travelAdvanceInDollars: {
      get() {
        return Math.ceil(this.travelAuthorization.travelAdvanceInCents / 100.0) || 0
      },
      set(value) {
        this.travelAuthorization.travelAdvanceInCents = Math.ceil(value * 100)
      },
    },
    hasEstimates() {
      return this.travelAuthorizationEstimates.length > 0
    },
  },
  async mounted() {
    await Promise.all([
      this.ensureCurrentUser(),
      this.ensureTravelAuthorization(this.travelAuthorizationId),
      this.refreshEstimatesSilently(),
    ])

    const department = this.currentUser.department
    await this.loadPreApprovedTravelRequests(department)
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorization", {
      ensureTravelAuthorization: "ensure",
      fetchTravelAuthorizationExpensesSilently: "fetchExpensesSilently",
    }),
    refreshEstimatesSilently() {
      this.refreshingEstimatesSilently = true
      return this.fetchTravelAuthorizationExpensesSilently(this.travelAuthorizationId).finally(
        () => {
          this.refreshingEstimatesSilently = false
        }
      )
    },
    loadPreApprovedTravelRequests(department) {
      // Since we can't determine if a pre-approval applies, the user doesn't get any options.
      if (isEmpty(department)) {
        this.preApprovedTravelRequests = []
        return
      }

      this.loadingPreApprovedTravelRequests = true
      return preApprovedTravelRequestsApi
        .list({ where: { department } })
        .then(({ preApprovedTravelRequests }) => {
          const flatRequests = this.flattenRequests(preApprovedTravelRequests)
          const options = flatRequests.map((request) => {
            const text = isEmpty(request.fullName)
              ? `${request.purpose} - ${request.month}`
              : `${request.purpose} - ${request.month} - ${request.fullName}`
            return {
              text,
              value: request.id,
            }
          })
          this.preApprovedTravelRequests = options
        })
        .finally(() => {
          this.loadingPreApprovedTravelRequests = false
        })
    },
    flattenRequests(preApprovedTravelRequests) {
      return preApprovedTravelRequests.flatMap(
        ({ preApprovedTravelers, ...otherRequestAttributes }) => {
          // If there are no travelers, return the request as is
          if (preApprovedTravelers.length === 0) {
            return {
              ...otherRequestAttributes,
              travelerID: null,
              fullName: null,
            }
          }

          // Otherwise, return an array of requests, one for each traveler
          return preApprovedTravelers.map((traveler) => ({
            ...otherRequestAttributes,
            travelerID: traveler.travelerID,
            fullName: traveler.fullName,
          }))
        }
      )
    },
  },
}
</script>
