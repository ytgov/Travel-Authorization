<template>
  <div>
    <TitleCard
      class="mt-10 mx-5"
      title-width="8.5rem"
    >
      <template #title>
        <div>Hotel Request</div>
      </template>
      <template #body>
        <div class="d-flex justify-end pr-4">
          <TravelDeskHotelCreateDialog
            class="ml-auto mr-3"
            :travel-desk-travel-request-id="travelDeskTravelRequestId"
            :min-date="minDate"
            :max-date="maxDate"
            :flight-start="earliestFlightDate"
            :flight-end="latestFlightDate"
            @created="refresh"
          />
        </div>
        <v-row class="mb-3 mx-3">
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="travelDeskHotels"
              hide-default-footer
              class="elevation-1"
            >
              <template #top>
                <TravelDeskHotelEditDialog
                  ref="editDialog"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :flight-start="earliestFlightDate"
                  :flight-end="latestFlightDate"
                  @saved="refresh"
                />
              </template>
              <template #item.isDedicatedConferenceHotelAvailable="{ item }">
                {{ item.isDedicatedConferenceHotelAvailable ? "Yes" : "No" }}
              </template>

              <template #item.checkIn="{ item }">
                {{ formatDate(item.checkIn) }}
              </template>

              <template #item.checkOut="{ item }">
                {{ formatDate(item.checkOut) }}
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
                    @click="deleteHotel(item)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
    </TitleCard>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, watch } from "vue"
import { DateTime } from "luxon"
import { isNil } from "lodash"
import { useRoute } from "vue2-helpers/vue-router"

import travelDeskHotelsApi from "@/api/travel-desk-hotels-api"
import useTravelAuthorization from "@/use/use-travel-authorization"
import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"
import useTravelDeskHotels from "@/use/use-travel-desk-hotels"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import TravelDeskHotelCreateDialog from "@/components/travel-desk-hotels/TravelDeskHotelCreateDialog.vue"
import TravelDeskHotelEditDialog from "@/components/travel-desk-hotels/TravelDeskHotelEditDialog.vue"

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

const route = useRoute()

const travelDeskHotelsQuery = computed(() => ({
  travelRequestId: props.travelDeskTravelRequestId,
}))
const { travelDeskHotels, isLoading, refresh } = useTravelDeskHotels(travelDeskHotelsQuery)

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const minDate = computed(() => travelAuthorization.value?.startDate?.slice(0, 10))
const maxDate = computed(() => travelAuthorization.value?.endDate?.slice(0, 10))

// TODO: maybe make an optimized query that returns the start/end dates?
const travelDeskFlightRequestsQuery = computed(() => ({
  travelRequestId: props.travelDeskTravelRequestId,
  perPage: 1000,
}))
const { earliestFlightDate, latestFlightDate } = useTravelDeskFlightRequests(
  travelDeskFlightRequestsQuery
)

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskHotelEditDialog> | null>} */
const editDialog = ref(null)

function formatDate(date) {
  return DateTime.fromISO(date, { zone: "utc" }).toFormat("MMM dd yyyy")
}

function showEditDialog(hotel) {
  editDialog.value?.show(hotel)
}

function showEditDialogForRouteQuery() {
  const hotelId = parseInt(route.query.showHotelEdit)
  if (isNaN(hotelId)) return

  const hotel = travelDeskHotels.value.find((hotel) => hotel.id === hotelId)
  if (isNil(hotel)) return

  showEditDialog(hotel)
}

watch(
  () => travelDeskHotels.value,
  (hotels) => {
    if (hotels.length === 0) return

    showEditDialogForRouteQuery()
  }
)

async function deleteHotel(hotel) {
  if (!confirm("Are you sure you want to remove this hotel?")) return

  try {
    await travelDeskHotelsApi.delete(hotel.id)
    await refresh()
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped></style>
