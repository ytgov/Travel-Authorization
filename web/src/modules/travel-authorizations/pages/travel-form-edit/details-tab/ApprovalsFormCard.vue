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
            md="3"
          >
            <!-- TODO: add tooltip with link to estimate tab explaining where this data comes from -->
            <v-text-field
              :value="formatCurrency(estimatedCost)"
              :rules="[required]"
              label="Estimated Cost"
              disabled
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="3"
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
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
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
import { isEmpty, sumBy } from "lodash"
import { mapActions, mapState } from "vuex"

import { TYPES } from "@/apis/expenses-api"
import preApprovedTravelRequestsApi from "@/apis/pre-approved-travel-requests-api"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"
import SubmitToSupervisorButton from "./SubmitToSupervisorButton"

export default {
  name: "ApprovalsFormCard",
  components: {
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
    ...mapState("travelForm", ["currentTravelAuthorization", "currentUser", "loadingCurrentUser"]),
    // TODO: Make this a getter in the store
    estimates() {
      return this.currentTravelAuthorization.expenses?.filter((expense) => expense.type === TYPES.ESTIMATE) || []
    },
    estimatedCost() {
      return sumBy(this.estimates, "cost")
    },
    travelAdvanceInDollars: {
      get() {
        return Math.ceil(this.currentTravelAuthorization.travelAdvanceInCents / 100.0)
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
    return this.loadPreApprovedTravelRequests(department)
  },
  methods: {
    ...mapActions("travelForm", ["loadCurrentUser"]),
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
    formatCurrency(amount) {
      const formatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      })
      return formatter.format(amount)
    },
  },
}
</script>
