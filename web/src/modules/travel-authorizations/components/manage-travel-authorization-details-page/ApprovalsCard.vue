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
            :loading="isLoadingPreApprovedTravelRequests"
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
            :value="currentTravelAuthorization.supervisorEmail"
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
import { isNil, isEmpty, sumBy } from "lodash"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "ApprovalsCard",
  components: {},
  data: () => ({}),
  computed: {
    ...mapGetters("current/travelAuthorization", {
      currentTravelAuthorization: "attributes",
      estimates: "estimates",
    }),
    ...mapGetters("preApprovedTravelRequests", {
      preApprovedTravelRequests: "items",
      isLoadingPreApprovedTravelRequests: "isLoading",
    }),
    estimatedCost() {
      return sumBy(this.estimates, "cost")
    },
    preApprovedTravelRequestText() {
      const preApprovedTravelRequest = this.preApprovedTravelRequests.find(
        (p) => p.value === this.currentTravelAuthorization.preappId
      )

      if (isNil(preApprovedTravelRequest)) {
        return ""
      }

      const { preApprovedTravelers } = preApprovedTravelRequest

      const travelerNames = preApprovedTravelers
        .map((traveler) => traveler.fullName)
        .filter(Boolean)
        .join(",")

      return isEmpty(travelerNames)
        ? `${preApprovedTravelRequest.purpose} - ${preApprovedTravelRequest.month}`
        : `${preApprovedTravelRequest.purpose} - ${preApprovedTravelRequest.month} - ${travelerNames}`
    },
    travelAdvanceInDollars() {
      return Math.ceil(this.currentTravelAuthorization.travelAdvanceInCents / 100.0)
    },
  },
  async mounted() {
    const { department } = this.currentTravelAuthorization.user
    await this.ensurePreApprovedTravelRequests({ where: { department } })
  },
  methods: {
    ...mapActions("preApprovedTravelRequests", {
      ensurePreApprovedTravelRequests: "ensure",
    }),
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
