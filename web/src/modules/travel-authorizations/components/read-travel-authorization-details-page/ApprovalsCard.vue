<template>
  <v-card>
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
            :value="travelAuthorizationPreApprovalProfileText"
            :loading="isLoadingTravelAuthorizationPreApprovalProfile"
            label="Pre-approved travel for (if applicable)"
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
            :value="travelAuthorization.supervisorEmail"
            label="Submit to"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <TravelAuthorizationActionLogsTable
            ref="travelAuthorizationActionLogsTable"
            :travel-authorization-id="travelAuthorizationId"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { isNil, isEmpty, sumBy } from "lodash"
import { mapActions, mapGetters } from "vuex"

import travelAuthorizationPreApprovalProfilesApi from "@/api/travel-authorization-pre-approval-profiles-api"

import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable"

export default {
  name: "ApprovalsCard",
  components: {
    TravelAuthorizationActionLogsTable,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    travelAuthorizationPreApprovalProfile: {},
    isLoadingTravelAuthorizationPreApprovalProfile: false,
  }),
  computed: {
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      estimates: "estimates",
    }),
    estimatedCost() {
      return sumBy(this.estimates, "cost")
    },
    travelAuthorizationPreApprovalProfileText() {
      if (
        isEmpty(this.travelAuthorizationPreApprovalProfile) ||
        this.isLoadingTravelAuthorizationPreApprovalProfile
      ) {
        return ""
      }

      return this.travelAuthorizationPreApprovalProfile.profileName
    },
    travelAdvanceInDollars() {
      return Math.ceil(this.travelAuthorization.travelAdvanceInCents / 100.0)
    },
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
    const { preApprovalProfileId } = this.travelAuthorization
    if (!isNil(preApprovalProfileId)) {
      await this.loadTravelAuthorizationPreApprovedProfile(preApprovalProfileId)
    }
  },
  methods: {
    ...mapActions("travelAuthorization", {
      ensureTravelAuthorization: "ensure",
    }),
    async loadTravelAuthorizationPreApprovedProfile(preApprovalProfileId) {
      this.isLoadingTravelAuthorizationPreApprovalProfile = true
      try {
        const { travelAuthorizationPreApprovalProfile: newProfile } =
          await travelAuthorizationPreApprovalProfilesApi.get(preApprovalProfileId)
        this.travelAuthorizationPreApprovalProfile = newProfile
      } finally {
        this.isLoadingTravelAuthorizationPreApprovalProfile = false
      }
    },
    refresh() {
      this.$refs.travelAuthorizationActionLogsTable.refresh()
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
