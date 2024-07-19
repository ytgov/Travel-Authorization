<template>
  <div>
    <TitleCard class="mt-10 mx-5">
      <template #title>
        <div>Hotel Request</div>
      </template>
      <template #body>
        <v-row class="mb-3 mx-3">
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="travelDeskHotels"
              :loading="isLoading"
              hide-default-footer
              class="elevation-1"
            >
              <template #item.isDedicatedConferenceHotelAvailable="{ item }">
                {{ item.isDedicatedConferenceHotelAvailable ? "Yes" : "No" }}
              </template>

              <template #item.checkIn="{ item }">
                {{ formatDate(item.checkIn) }}
              </template>

              <template #item.checkOut="{ item }">
                {{ formatDate(item.checkOut) }}
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

import useTravelDeskHotels from "@/use/use-travel-desk-hotels"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const headers = ref([
  { text: "Check-in", value: "checkIn", class: "blue-grey lighten-4" },
  { text: "Check-out", value: "checkOut", class: "blue-grey lighten-4" },
  { text: "City", value: "city", class: "blue-grey lighten-4", sortable: false },
  {
    text: "Conference Hotel?",
    value: "isDedicatedConferenceHotelAvailable",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Conference/Meeting Name",
    value: "conferenceName",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Conference/Meeting Hotel",
    value: "conferenceHotelName",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Additional Information",
    value: "additionalInformation",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "",
    value: "actions",
    class: "blue-grey lighten-4",
    width: "4rem",
    sortable: false,
  },
])

const travelDeskHotelsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskHotels, isLoading } = useTravelDeskHotels(travelDeskHotelsQuery)

function formatDate(date) {
  return DateTime.fromISO(date, { zone: "utc" }).toFormat("MMM dd yyyy")
}
</script>

<style scoped></style>
