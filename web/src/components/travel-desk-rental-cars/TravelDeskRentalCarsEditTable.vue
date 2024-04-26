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
        <div class="d-flex justify-end pr-4">
          <TravelDeskRentalCarCreateDialog
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
              :items="travelDeskRentalCars"
              :loading="isLoading"
              hide-default-footer
              class="elevation-1"
            >
              <template #top>
                <TravelDeskRentalCarEditDialog
                  ref="editDialog"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :flight-start="earliestFlightDate"
                  :flight-end="latestFlightDate"
                  @saved="refresh"
                />
              </template>
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
                    @click="deleteRentalCar(item)"
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

import travelDeskRentalCarsApi from "@/api/travel-desk-rental-cars-api"
import useTravelAuthorization from "@/use/use-travel-authorization"
import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"
import useTravelDeskRentalCars, { LOCATION_TYPES } from "@/use/use-travel-desk-rental-cars"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import TravelDeskRentalCarCreateDialog from "@/components/travel-request-rental-cars/TravelDeskRentalCarCreateDialog.vue"
import TravelDeskRentalCarEditDialog from "@/components/travel-request-rental-cars/TravelDeskRentalCarEditDialog.vue"

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

const route = useRoute()

const travelDeskRentalCarsQuery = computed(() => ({
  travelRequestId: props.travelDeskTravelRequestId,
}))
const { travelDeskRentalCars, isLoading, refresh } =
  useTravelDeskRentalCars(travelDeskRentalCarsQuery)

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const minDate = computed(() => travelAuthorization.value?.startDate?.slice(0, 10))
const maxDate = computed(() => travelAuthorization.value?.endDate?.slice(0, 10))

// TODO: maybe make an optimized query that returns the start/end dates?
const travelDeskFlightRequestsQuery = computed(() => ({
  travelRequestId: props.travelDeskTravelRequestId,
  perPage: 1000,
}))
const {
  earliestFlightDate,
  latestFlightDate,
  refresh: refreshFlightRequests,
} = useTravelDeskFlightRequests(travelDeskFlightRequestsQuery)

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskRentalCarEditDialog> | null>} */
const editDialog = ref(null)

function formatDate(date) {
  return DateTime.fromISO(date, { zone: "utc" }).toFormat("MMM dd yyyy, HH:mm")
}

function showEditDialog(flightRequest) {
  editDialog.value?.show(flightRequest)
}

function showEditDialogForRouteQuery() {
  const rentalCarId = parseInt(route.query.showRentalCarEdit)
  if (isNaN(rentalCarId)) return

  const rentalCar = travelDeskRentalCars.value.find((rentalCar) => rentalCar.id === rentalCarId)
  if (isNil(rentalCar)) return

  showEditDialog(rentalCar)
}

watch(
  () => travelDeskRentalCars.value,
  (rentalCars) => {
    if (rentalCars.length === 0) return

    showEditDialogForRouteQuery()
  }
)

async function deleteRentalCar(flightRequest) {
  if (!confirm("Are you sure you want to remove this rental car?")) return

  try {
    await travelDeskRentalCarsApi.delete(flightRequest.id)
    await refresh()
  } catch (error) {
    console.error(error)
  }
}

defineExpose({
  refresh: refreshFlightRequests,
})
</script>

<style scoped></style>
