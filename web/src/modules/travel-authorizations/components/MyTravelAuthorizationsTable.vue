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
      <template #top>
        <DeleteTravelAuthorizationDialog
          ref="deleteDialog"
          @deleted="refresh"
        />
      </template>
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
        <v-btn
          v-else-if="actions.includes('delete')"
          class="ml-2"
          color="error"
          @click.stop="showDeleteDialog(item)"
          >Delete</v-btn
        >
        <SubmitTravelDeskRequestButton
          v-else-if="actions.includes('submit_travel_desk_request')"
          :travel-authorization-id="item.id"
        />
        <TravelDeskOptionsProvidedButton
          v-else-if="actions.includes('travel_desk_options_provided')"
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
        <span v-else> ERROR: unknown actions: {{ actions }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { isNil, isEmpty } from "lodash"
import { DateTime } from "luxon"

import { STATUSES as TRAVEL_AUTHORIZATION_STATUSES } from "@/api/travel-authorizations-api"

import AddExpenseButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/AddExpenseButton.vue"
import DeleteTravelAuthorizationDialog from "@/modules/travel-authorizations/components/my-travel-authorizations-table/DeleteTravelAuthorizationDialog.vue"
import TravelDeskOptionsProvidedButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/TravelDeskOptionsProvidedButton.vue"
import SubmitExpenseClaimButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/SubmitExpenseClaimButton.vue"
import SubmitPoolVehicleRequestButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/SubmitPoolVehicleRequestButton.vue"
import SubmitTravelDeskRequestButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/SubmitTravelDeskRequestButton.vue"
import ViewItineraryButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/ViewItineraryButton.vue"

export default {
  name: "MyTravelAuthorizationsTable",
  components: {
    AddExpenseButton,
    DeleteTravelAuthorizationDialog,
    TravelDeskOptionsProvidedButton,
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
    ...mapGetters("current/user", {
      currentUserId: "id",
    }),
    ...mapGetters("travelAuthorizations", ["items", "totalCount", "isLoading"]),
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
    await this.ensureCurrentUser()
    await this.refresh()
    this.showDeleteDialogForRouteQuery()
  },
  methods: {
    ...mapActions("current/user", {
      ensureCurrentUser: "ensure",
    }),
    ...mapActions("travelAuthorizations", ["ensure"]),
    isEmpty,
    refresh() {
      return this.ensure({
        where: { userId: this.currentUserId },
        page: this.page,
        perPage: this.perPage,
      })
    },
    goToFormDetails(travelAuthorization) {
      const travelAuthorizationId = travelAuthorization.id
      if (travelAuthorization.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT) {
        this.$router.push({
          name: "my-travel-requests/details/DetailsEditPurposePage",
          params: { travelAuthorizationId },
        })
      } else if (travelAuthorization.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED) {
        this.$router.push({
          name: "my-travel-requests/AwaitingApprovalPage",
          params: { travelAuthorizationId },
        })
      } else {
        this.$router.push({
          name: "my-travel-requests/details/DetailsPage",
          params: { travelAuthorizationId },
        })
      }
    },
    showDeleteDialog(item) {
      this.$refs.deleteDialog.show(item)
    },
    showDeleteDialogForRouteQuery() {
      const itemId = parseInt(this.$route.query.showDelete)
      if (isNaN(itemId)) return

      const item = this.items.find((item) => item.id === itemId)
      if (!item) return

      this.showDeleteDialog(item)
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
