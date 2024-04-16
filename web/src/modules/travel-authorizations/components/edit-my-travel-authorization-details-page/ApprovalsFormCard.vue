<template>
  <v-card>
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
            <TravelAuthorizationPreApprovalProfileSelect
              v-model="travelAuthorization.preApprovalProfileId"
              :department="department"
              dense
              outlined
            />
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
          <TravelAuthorizationActionLogsTable :travel-authorization-id="travelAuthorizationId" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"
import TravelAuthorizationPreApprovalProfileSelect from "@/components/travel-authorization-pre-approval-profiles/TravelAuthorizationPreApprovalProfileSelect"
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
    TravelAuthorizationPreApprovalProfileSelect,
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
    department() {
      return this.currentUser?.department
    },
  },
  async mounted() {
    await Promise.all([
      this.ensureCurrentUser(),
      this.ensureTravelAuthorization(this.travelAuthorizationId),
      this.refreshEstimatesSilently(),
    ])
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
  },
}
</script>
