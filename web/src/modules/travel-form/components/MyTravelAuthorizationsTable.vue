<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="myForms"
      :loading="loadingForms"
      :items-per-page.sync="perPage"
      :page.sync="page"
      :server-items-length="totalCount"
      class="elevation-2"
      @click:row="goToFormDetails"
    >
      <template #item.phase="{ value }">
        <span>{{ formatPhase(value) }}</span>
      </template>
      <template #item.finalDestination="{ value }">
        <span>{{ formatLocation(value) }}</span>
      </template>
      <template #item.departingAt="{ value }">
        <span>{{ formatDate(value) }}</span>
      </template>
      <template #item.returningAt="{ value }">
        <span>{{ formatDate(value) }}</span>
      </template>
      <template #item.status="{ value }">
        <span>{{ formatStatus(value) }}</span>
      </template>
      <template #item.action="{ value: actions, item }">
        <template v-if="isEmpty(actions)">
          <!-- no action: this is a valid state -->
        </template>
        <SubmitTravelDeskRequestButton
          v-if="actions.includes('submit_travel_desk_request')"
          :travel-authorization-id="item.id"
        />
        <!-- TODO: decompose these into external components -->
        <v-btn
          v-else-if="actions.includes('submit_expense_claim')"
          color="primary"
        >
          Submit Expense Claim
        </v-btn>
        <v-btn
          v-else-if="actions.includes('view_itinerary')"
          color="primary"
        >
          View Itinerary
        </v-btn>
        <v-btn
          v-else-if="actions.includes('add_expense')"
          color="primary"
        >
          Add Expense
        </v-btn>
        <v-btn
          v-else-if="actions.includes('submit_pool_vehicle_request')"
          color="primary"
        >
          Submit Pool Vehicle Request
        </v-btn>
        <span v-else> ERROR: unknown action: {{ value }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { isNil, isEmpty } from "lodash"
import { DateTime } from "luxon"

import SubmitTravelDeskRequestButton from "./my-travel-authorization-table/SubmitTravelDeskRequestButton"

export default {
  name: "MyTravelAuthorizationsTable",
  components: {
    SubmitTravelDeskRequestButton,
  },
  data: () => ({
    headers: [
      {
        text: "Phase",
        value: "phase",
      },
      {
        text: "Location",
        value: "finalDestination",
      },
      {
        text: "Description",
        value: "eventName",
      },
      {
        text: "Start Date",
        value: "departingAt",
      },
      {
        text: "End Date",
        value: "returningAt",
      },
      {
        text: "Travel Auth Status",
        value: "status",
      },
      {
        text: "Travel Action",
        value: "action",
      },
    ],
    perPage: 10,
    page: 1,
    totalCount: 1,
    loadingForms: true,
  }),
  async mounted() {
    await this.refreshForms()
  },
  computed: {
    ...mapState("travelForm", ["myForms"]),
  },
  methods: {
    ...mapActions("travelForm", ["loadForms"]),
    isEmpty,
    refreshForms() {
      this.loadingForms = true
      return this.loadForms({ page: this.page, perPage: this.perPage })
        .then(({ totalCount }) => {
          this.totalCount = totalCount
        })
        .finally(() => {
          this.loadingForms = false
        })
    },
    goToFormDetails(form) {
      const formId = form.id
      this.$router.push({ name: "TravelFormEdit-DetailsTab", params: { formId } })
    },
    formatDate(value) {
      if (isNil(value)) return "Unknown"

      const date = DateTime.fromISO(value, { zone: "utc" })
      return date.toFormat("dd-LLL-yyyy")
    },
    formatLocation(value) {
      if (isNil(value) || isNil(value.city)) return "Unknown"

      return value.city
    },
    formatStatus(value) {
      return this.$t(`global.status.${value}`, "Unknown")
    },
    formatPhase(value) {
      return this.$t(`global.phase.${value}`, "Unknown")
    },
  },
  watch: {
    page() {
      this.refreshForms()
    },
    perPage() {
      this.refreshForms()
    },
  },
}
</script>

<style scoped></style>
