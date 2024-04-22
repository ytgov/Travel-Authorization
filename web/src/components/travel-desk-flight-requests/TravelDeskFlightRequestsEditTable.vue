<template>
  <v-card
    :loading="isLoading"
    class="pt-1"
  >
    <div class="d-flex justify-end pr-4">
      <TravelDeskFlightRequestCreateDialog
        :loading="isLoading"
        :min-date="minDate"
        :max-date="maxDate"
        type="Add New"
        :flight-request="flightRequest"
        @updateTable="updateTable"
      />
    </div>
    <v-row class="mb-3 mx-0">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="travelDeskFlightRequests"
          hide-default-footer
          class="elevation-1"
        >
          <template #item.date="{ item }">
            {{ item.date | beautifyDateTime }}
          </template>

          <template #item.edit="{ item }">
            <v-row class="mx-0 py-0 mt-n6 mb-n6">
              <v-col cols="6">
                <TravelDeskFlightRequestCreateDialog
                  type="Edit"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :flight-request="item"
                  @updateTable="updateTable"
                />
              </v-col>
              <v-col cols="6">
                <v-btn
                  style="min-width: 0"
                  color="transparent"
                  class="px-1 pt-2"
                  small
                  @click="removeFlight(item)"
                  ><v-icon
                    class=""
                    color="red"
                    >mdi-close</v-icon
                  >
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed, toRefs } from "vue"
import { cloneDeep } from "lodash"

import { TRAVEL_DESK_URL } from "@/urls"
import { securePost } from "@/store/jwt"

import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"

import TravelDeskFlightRequestCreateDialog from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestCreateDialog.vue"
import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  travelAuthorizationId: {
    type: Object,
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
  { text: "Date", value: "date", class: "blue-grey lighten-4" },
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
  { text: "", value: "edit", class: "blue-grey lighten-4", width: "4rem", sortable: false },
]

const travelDeskFlightRequestsQuery = computed(() => ({
  travelRequestId: props.travelDeskTravelRequestId,
}))
const { travelDeskFlightRequests, isLoading, refresh } = useTravelDeskFlightRequests(
  travelDeskFlightRequestsQuery
)
const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const flightRequest = ref({})
const tmpId = ref(1)
const minDate = computed(() => travelAuthorization.value?.startDate?.slice(0, 10))
const maxDate = computed(() => travelAuthorization.value?.endDate?.slice(0, 10))

onMounted(async () => {
  await initForm()
})

async function initForm() {
  const flightRequest = {}
  flightRequest.flightRequestId = null
  flightRequest.tmpId = null

  flightRequest.departLocation = ""
  flightRequest.arriveLocation = ""
  flightRequest.date = ""
  flightRequest.timePreference = ""
  flightRequest.seatPreference = ""
  flightRequest.flightOptions = []

  flightRequest.value = flightRequest
}

async function updateTable(type) {
  if (type == "Add New") {
    flightRequest.value.tmpId = tmpId.value
    travelDeskFlightRequests.value.push(cloneDeep(flightRequest.value))
    tmpId.value++
    await saveFlightRequests()
  } else if (type == "Edit") {
    await saveFlightRequests()
  }
}

async function removeFlight(item) {
  // console.log(item)
  let delIndex = -1
  if (item.flightRequestId > 0)
    delIndex = travelDeskFlightRequests.value.findIndex(
      (flight) => flight.flightRequestId && flight.flightRequestId == item.flightRequestId
    )
  else
    delIndex = travelDeskFlightRequests.value.findIndex(
      (flight) => flight.tmpId && flight.tmpId == item.tmpId
    )
  // console.log(delIndex)
  if (delIndex >= 0) {
    travelDeskFlightRequests.value.splice(delIndex, 1)
    await saveFlightRequests()
  }
}

async function saveFlightRequests() {
  isLoading.value = true
  const body = travelDeskFlightRequests.value

  return securePost(`${TRAVEL_DESK_URL}/flight-request/${props.travelDeskTravelRequestId}`, body)
    .then(async () => {
      await refresh()
      isLoading.value = false
    })
    .catch((e) => {
      console.log(e)
      isLoading.value = false
    })
}
</script>

<style scoped>
::v-deep .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  background: #f9f9f9 !important;
}
</style>
