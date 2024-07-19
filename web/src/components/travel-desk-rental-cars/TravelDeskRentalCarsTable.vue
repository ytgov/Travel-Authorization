<template>
  <div>
    <TitleCard
      class="mt-10 mx-5"
      title-width="11rem"
    >
      <template #title>
        <div>Rental Car Request</div>
      </template>
      <template #body>
        <v-row class="mb-3 mx-3">
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="travelDeskRentalCars"
              :loading="isLoading"
              hide-default-footer
              class="elevation-1"
            >
              <template #item.matchFlightTimes="{ item }">
                {{ item.matchFlightTimes ? "Yes" : "No" }}
              </template>
              <template #item.pickUpLocation="{ item }">
                <div v-if="item.pickUpLocation === LOCATION_TYPES.OTHER">
                  {{ item.pickUpLocationOther }}
                </div>
                <div v-else>{{ item.pickUpLocation }}</div>
              </template>

              <template #item.dropOffLocation="{ item }">
                <div
                  v-if="item.sameDropOffLocation && item.pickUpLocation === LOCATION_TYPES.OTHER"
                >
                  {{ item.pickUpLocationOther }}
                </div>
                <div v-else-if="item.sameDropOffLocation">{{ item.pickUpLocation }}</div>
                <div v-else>{{ item.dropOffLocation }}</div>
              </template>

              <template #item.pickUpDate="{ value }">
                {{ formatDate(value) }}
              </template>
              <template #item.dropOffDate="{ value }">
                {{ formatDate(value) }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
    </TitleCard>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { DateTime } from "luxon"

import useTravelDeskRentalCars, { LOCATION_TYPES } from "@/use/use-travel-desk-rental-cars"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const headers = ref([
  {
    text: "Match Flight Times",
    value: "matchFlightTimes",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Pick-Up City",
    value: "pickUpCity",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Pick-up Location",
    value: "pickUpLocation",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Drop-off City",
    value: "dropOffCity",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Drop-off Location",
    value: "dropOffLocation",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "Pick-up Date", value: "pickUpDate", class: "blue-grey lighten-4" },
  { text: "Drop-off Date", value: "dropOffDate", class: "blue-grey lighten-4" },

  {
    text: "Vehicle Type",
    value: "vehicleType",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Reason Change",
    value: "vehicleChangeRationale",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Additional Notes",
    value: "additionalNotes",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "", value: "actions", class: "blue-grey lighten-4", width: "4rem", sortable: false },
])

const travelDeskRentalCarsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskRentalCars, isLoading } = useTravelDeskRentalCars(travelDeskRentalCarsQuery)

function formatDate(date) {
  return DateTime.fromISO(date, { zone: "utc" }).toFormat("MMM dd yyyy, HH:mm")
}
</script>

<style scoped></style>
