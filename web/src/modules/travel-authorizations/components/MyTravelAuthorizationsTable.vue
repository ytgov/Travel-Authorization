<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="isLoading"
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
          v-else-if="actions.includes('submit_travel_desk_request')"
          :travel-authorization-id="item.id"
        />
        <SubmitExpenseClaimButton
          v-else-if="actions.includes('submit_expense_claim')"
          :travel-authorization-id="item.id"
        />
        <ViewItineraryButton
          v-else-if="actions.includes('view_itinerary')"
          :travel-authorization-id="item.id"
        />
        <AddExpenseButton
          v-else-if="actions.includes('add_expense')"
          :travel-authorization-id="item.id"
        />
        <SubmitPoolVehicleRequestButton
          v-else-if="actions.includes('submit_pool_vehicle_request')"
          :travel-authorization-id="item.id"
        />
        <span v-else> ERROR: unknown action: {{ value }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { isNil, isEmpty } from "lodash"
import { DateTime } from "luxon"

import AddExpenseButton from "./my-travel-authorizations-table/AddExpenseButton"
import SubmitExpenseClaimButton from "./my-travel-authorizations-table/SubmitExpenseClaimButton"
import SubmitPoolVehicleRequestButton from "./my-travel-authorizations-table/SubmitPoolVehicleRequestButton"
import SubmitTravelDeskRequestButton from "./my-travel-authorizations-table/SubmitTravelDeskRequestButton"
import ViewItineraryButton from "./my-travel-authorizations-table/ViewItineraryButton"

export default {
  name: "MyTravelAuthorizationsTable",
  components: {
    AddExpenseButton,
    SubmitExpenseClaimButton,
    SubmitPoolVehicleRequestButton,
    SubmitTravelDeskRequestButton,
    ViewItineraryButton,
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
  }),
  computed: {
    ...mapState("currentUser/travelAuthorizations", ["items", "totalCount", "isLoading"]),
  },
  watch: {
    page() {
      this.refresh()
    },
    perPage() {
      this.refresh()
    },
  },
  async mounted() {
    await this.refresh()
  },
  methods: {
    ...mapActions("currentUser/travelAuthorizations", ["initialize"]),
    isEmpty,
    refresh() {
      return this.initialize({ page: this.page, perPage: this.perPage })
    },
    goToFormDetails(form) {
      const formId = form.id
      if (form.status === "draft") {
        this.$router.push({ name: "MyTravelAuthorizationEditDetailsPage", params: { formId } })
      } else {
        this.$router.push({
          name: "TravelAuthorizationRead-DetailsTab",
          params: { formId },
        })
      }
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
      return this.$t(`global.status.${value}`, { $default: "Unknown" })
    },
    formatPhase(value) {
      return this.$t(`global.phase.${value}`, { $default: "Unknown" })
    },
  },
}
</script>

<style scoped></style>
