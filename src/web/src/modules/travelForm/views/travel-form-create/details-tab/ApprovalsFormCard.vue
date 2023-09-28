<template>
  <v-card
    elevation="2"
    class="default"
  >
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
            <v-text-field
              :value="estimatedCost"
              :rules="[required]"
              label="Estimated Cost"
              background-color="white"
              prefix="$"
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
              background-color="white"
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
              v-model="request.preappId"
              :items="preApprovedTravelRequests"
              :loading="loadingCurrentUser || loadingPreApprovedTravelRequests"
              label="Pre-approved Travel Request?"
              no-data-text="No pre-approvals available"
              background-color="white"
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
              v-model="request.supervisorEmail"
              :rules="[required]"
              label="Submit to"
              background-color="white"
              dense
              outlined
              required
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { isEmpty } from "lodash"
import { mapActions, mapState } from "vuex"

import preApprovedTravelRequestsApi from "@/apis/pre-approved-travel-requests-api"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"

export default {
  name: "ApprovalsFormCard",
  components: {
    SearchableUserEmailCombobox,
  },
  data: () => ({
    required: (v) => !!v || "This field is required",
    isInteger: (v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number",
    estimatedCost: 1234567.89, // TODO: figure out what would be required to generate this value
    preApprovedTravelRequests: [],
    loadingPreApprovedTravelRequests: false,
  }),
  computed: {
    ...mapState("travelForm", ["request", "currentUser", "loadingCurrentUser"]),
    travelAdvanceInDollars: {
      get() {
        return Math.ceil(this.request.travelAdvanceInCents / 100.0)
      },
      set(value) {
        this.request.travelAdvanceInCents = Math.ceil(value * 100)
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
      return preApprovedTravelRequests.flatMap(({ preApprovedTravelers, ...otherRequestAttributes }) => {
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
      })
    },
  },
}
</script>
