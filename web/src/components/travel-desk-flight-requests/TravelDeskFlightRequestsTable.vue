<template>
  <v-card
    :loading="isLoading"
    class="pt-1"
  >
    <v-row class="mb-3 mx-0">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="travelDeskFlightRequests"
          :loading="isLoading"
          hide-default-footer
          class="elevation-1"
        >
          <template #item.datePreference="{ value }">
            {{ formatDate(value) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { DateTime } from "luxon"

import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"

const props = defineProps({
  travelDeskTravelRequestId: {
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

const travelDeskFlightRequestsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskFlightRequests, isLoading } = useTravelDeskFlightRequests(
  travelDeskFlightRequestsQuery
)

function formatDate(date) {
  return DateTime.fromISO(date).toFormat("MMM d yyyy")
}
</script>

<style scoped>
::v-deep .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  background: #f9f9f9 !important;
}
</style>
