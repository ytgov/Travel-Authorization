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
        <v-select
          v-model="request.preappId"
          :items="preApprovedTravelRequests"
          :loading="loadingPreApprovedTravelRequests"
          :rules="[required]"
          label="Pre-approved Travel Request?"
          background-color="white"
          dense
          outlined
          required
        ></v-select>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex"
import { isEmpty } from "lodash"

import preApprovedTravelRequestsApi from "@/apis/pre-approved-travel-requests-api"

export default {
  name: "ApprovalsFormCard",
  data: () => ({
    required: (v) => !!v || "This field is required",
    isInteger: (v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number",
    estimatedCost: 1230.45, // TODO: figure out what would be required to generate this value
    preApprovedTravelRequests: [],
    loadingPreApprovedTravelRequests: false,
  }),
  computed: {
    ...mapState("travelForm", ["request"]),
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
    await this.loadPreApprovedTravelRequests()
  },
  methods: {
    loadPreApprovedTravelRequests() {
      if (isEmpty(this.request.department)) {
        console.warn(
          "This request doesn't have an associated department ... yet? " +
            "Consider loading the user before calling this action."
        )
      }

      this.loadingPreApprovedTravelRequests = true
      return preApprovedTravelRequestsApi
        .list({ where: { department: this.request.department } })
        .then(({ preApprovedTravelRequests }) => {
          this.preApprovedTravelRequests = preApprovedTravelRequests
        })
        .finally(() => {
          this.loadingPreApprovedTravelRequests = true
        })
    },
  },
}
</script>
