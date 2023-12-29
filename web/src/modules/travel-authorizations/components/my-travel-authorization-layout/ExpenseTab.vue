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
        <li v-if="isInPreExpensingStates">not approved</li>
        <li v-if="isBeforeTravelStartDate">start date has not passed</li>
      </ul>
    </span>
  </v-tooltip>
  <v-tab
    v-else
    :to="{ name: componentName, params: { travelAuthorizationId } }"
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
    componentName() {
      if (this.isEditable) {
        return "EditMyTravelAuthorizationExpensePage"
      }

      return "ReadMyTravelAuthorizationExpensePage"
    },
    isEditable() {
      return this.travelAuthorization.status === STATUSES.APPROVED && this.isAfterTravelStartDate
    },
    isInPreExpensingStates() {
      return (
        this.travelAuthorization.status === STATUSES.DRAFT ||
        this.travelAuthorization.status === STATUSES.SUBMITTED
      )
    },
    isBeforeTravelStartDate() {
      const firstTravelSegment = this.travelAuthorization.travelSegments[0]
      if (isNil(firstTravelSegment)) return false

      return new Date(firstTravelSegment.departureOn) > new Date()
    },
    isAfterTravelStartDate() {
      return !this.isBeforeTravelStartDate
    },
    isExpenseTabDisabled() {
      return this.isInPreExpensingStates || this.isBeforeTravelStartDate
    },
  },
  watch: {
    async $route(to, from) {
      if (
        to.name === "ReadMyTravelAuthorizationExpensePage" &&
        from.name === "EditMyTravelAuthorizationExpensePage"
      ) {
        await this.fetchTravelAuthorization(this.travelAuthorizationId)
      }
    },
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
  },
  methods: {
    ...mapActions("travelAuthorization", {
      ensureTravelAuthorization: "ensure",
      fetchTravelAuthorization: "fetch",
    }),
  },
}
</script>
