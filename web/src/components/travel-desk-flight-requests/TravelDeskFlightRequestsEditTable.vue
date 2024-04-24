<template>
  <v-card
    :loading="isLoading"
    class="pt-1"
  >
    <div class="d-flex justify-end pr-4">
      <TravelDeskFlightRequestCreateDialog
        :travel-desk-travel-request-id="travelDeskTravelRequestId"
        :min-date="minDate"
        :max-date="maxDate"
        @created="refresh"
      />
    </div>
    <v-row class="mb-3 mx-0">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="travelDeskFlightRequests"
          :loading="isLoading"
          hide-default-footer
          class="elevation-1"
        >
          <template #top>
            <TravelDeskFlightRequestEditDialog
              ref="editDialog"
              :min-date="minDate"
              :max-date="maxDate"
              @saved="refresh"
            />
          </template>
          <template #item.datePreference="{ value }">
            {{ formatDate(value) }}
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-end">
              <v-btn
                title="Edit"
                icon
                color="blue"
                @click="showEditDialog(item)"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                :loading="isLoading"
                title="Delete"
                icon
                color="red"
                @click="deleteFlightRequest(item)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { isNil } from "lodash"
import { ref, computed, toRefs, watch } from "vue"
import { useRoute } from "vue2-helpers/vue-router"
import { DateTime } from "luxon"

import travelDeskFlightRequestsApi from "@/api/travel-desk-flight-requests-api"
import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"

import TravelDeskFlightRequestCreateDialog from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestCreateDialog.vue"
import TravelDeskFlightRequestEditDialog from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestEditDialog.vue"
import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const headers = [
  {
    text: "Depart Location",
    value: "departLocation",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Arrive Location",
    value: "arriveLocation",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "Date", value: "datePreference", class: "blue-grey lighten-4" },
  {
    text: "Time Preference",
    value: "timePreference",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Seat Preference",
    value: "seatPreference",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "", value: "actions", class: "blue-grey lighten-4", width: "4rem", sortable: false },
]

const route = useRoute()

const travelDeskFlightRequestsQuery = computed(() => ({
  travelRequestId: props.travelDeskTravelRequestId,
}))
const { travelDeskFlightRequests, isLoading, refresh } = useTravelDeskFlightRequests(
  travelDeskFlightRequestsQuery
)
const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const minDate = computed(() => travelAuthorization.value?.startDate?.slice(0, 10))
const maxDate = computed(() => travelAuthorization.value?.endDate?.slice(0, 10))

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskFlightRequestEditDialog> | null>} */
const editDialog = ref(null)

function formatDate(date) {
  return DateTime.fromISO(date).toFormat("MMM d yyyy")
}

function showEditDialog(flightRequest) {
  editDialog.value?.show(flightRequest)
}

function showEditDialogForRouteQuery() {
  const flightRequestId = parseInt(route.query.showFlightRequestEdit)
  if (isNaN(flightRequestId)) return

  const flightRequest = travelDeskFlightRequests.value.find(
    (flightRequest) => flightRequest.id === flightRequestId
  )
  if (isNil(flightRequest)) return

  showEditDialog(flightRequest)
}

watch(
  () => travelDeskFlightRequests.value,
  (flightRequests) => {
    if (flightRequests.length === 0) return

    showEditDialogForRouteQuery()
  }
)

async function deleteFlightRequest(flightRequest) {
  if (!confirm("Are you sure you want to remove this flight request?")) return

  try {
    await travelDeskFlightRequestsApi.delete(flightRequest.id)
    await refresh()
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
::v-deep .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  background: #f9f9f9 !important;
}
</style>
