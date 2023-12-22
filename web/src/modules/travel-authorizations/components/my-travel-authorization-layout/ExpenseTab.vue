<template>
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
  <!-- TODO: this will need updating if there is ever a read-only expense view -->
  <v-tab
    v-else
    :to="{ name: 'MyTravelAuthorizationExpensePage', params: { travelAuthorizationId } }"
  >
    Expense
  </v-tab>
</template>

<script>
import { isNil } from "lodash"
import { mapActions, mapGetters } from "vuex"

import { STATUSES } from "@/api/travel-authorizations-api"

export default {
  name: "ExpenseTab",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("travelAuthorization", { travelAuthorization: "attributes" }),
    isTravelAuthorizationApproved() {
      return this.travelAuthorization.status === STATUSES.APPROVED
    },
    isAfterTravelStartDate() {
      const firstTravelSegment = this.travelAuthorization.travelSegments[0]
      if (isNil(firstTravelSegment)) return false

      return new Date(firstTravelSegment.departureOn) < new Date()
    },
    isExpenseTabDisabled() {
      return !this.isTravelAuthorizationApproved || !this.isAfterTravelStartDate
    },
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
  },
  methods: {
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
  },
}
</script>
