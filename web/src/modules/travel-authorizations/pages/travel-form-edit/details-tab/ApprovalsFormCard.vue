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
            <EstimatedCostTextField :estimates="estimates" />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-btn
              :to="{
                name: 'TravelFormEdit-EstimateTab',
                params: { formId: currentTravelAuthorizationId },
              }"
              class="mt-1"
              color="secondary"
              >Go to Esitmate tab</v-btn
            >
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
              v-model="currentTravelAuthorization.preappId"
              :items="preApprovedTravelRequests"
              :loading="loadingCurrentUser || loadingPreApprovedTravelRequests"
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
              v-model="currentTravelAuthorization.supervisorEmail"
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
              :validate-form="validateForm"
              class="mt-1"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { isEmpty } from "lodash"
import { mapActions, mapState, mapGetters } from "vuex"

import preApprovedTravelRequestsApi from "@/apis/pre-approved-travel-requests-api"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"

import EstimatedCostTextField from "./approvals-form-card/EstimatedCostTextField"
import SubmitToSupervisorButton from "./approvals-form-card/SubmitToSupervisorButton"

export default {
  name: "ApprovalsFormCard",
  components: {
    EstimatedCostTextField,
    SearchableUserEmailCombobox,
    SubmitToSupervisorButton,
  },
  props: {
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
  }),
  computed: {
    ...mapState("travelAuthorizations", [
      "currentTravelAuthorization",
      "currentUser",
      "loadingCurrentUser",
    ]),
    ...mapGetters("travelAuthorizations", ["currentTravelAuthorizationId", "estimates"]),
    travelAdvanceInDollars: {
      get() {
        return Math.ceil(this.currentTravelAuthorization.travelAdvanceInCents / 100.0) || 0
      },
      set(value) {
        this.currentTravelAuthorization.travelAdvanceInCents = Math.ceil(value * 100)
      },
    },
  },
  async mounted() {
    const department = !isEmpty(this.currentUser.department)
      ? this.currentUser.department
      : await this.loadCurrentUser().then((user) => user.department)
    await this.loadPreApprovedTravelRequests(department)
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadCurrentUser"]),
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
