<template>
  <v-card elevation="2">
    <v-card-title> Approvals </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <!-- TODO: add tooltip with link to estimate tab explaining where this data comes from -->
          <v-text-field
            :value="formatCurrency(estimatedCost)"
            label="Estimated Cost"
            disabled
            dense
            outlined
            readonly
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelAdvanceInDollars"
            label="Travel Advance"
            prefix="$"
            dense
            outlined
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :value="preApprovedTravelRequestText"
            :loading="loadingCurrentUser || loadingPreApprovedTravelRequests"
            label="Pre-approved Travel Request?"
            no-data-text="No pre-approvals available"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="currentForm.supervisorEmail"
            label="Submit to"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { isEmpty, sumBy } from "lodash"
import { mapActions, mapState } from "vuex"

import { TYPES } from "@/apis/expenses-api"
import preApprovedTravelRequestsApi from "@/apis/pre-approved-travel-requests-api"

export default {
  name: "ApprovalsCard",
  components: {},
  data: () => ({
    preApprovedTravelRequests: [],
    loadingPreApprovedTravelRequests: false,
  }),
  computed: {
    ...mapState("travelForm", ["currentForm", "currentUser", "loadingCurrentUser"]),
    // TODO: Make this a getter in the store
    estimates() {
      return this.currentForm.expenses?.filter((expense) => expense.type === TYPES.ESTIMATE) || []
    },
    estimatedCost() {
      return sumBy(this.estimates, "cost")
    },
    preApprovedTravelRequestText() {
      const preApprovedTravelRequest = this.preApprovedTravelRequests.find(
        (p) => p.value === this.currentForm.preappId
      )
      console.log("preApprovedTravelRequest:", preApprovedTravelRequest)
      return preApprovedTravelRequest?.text || ""
    },
    travelAdvanceInDollars() {
      return Math.ceil(this.currentForm.travelAdvanceInCents / 100.0)
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
