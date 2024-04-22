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
          <template #item.datePreference="{ item }">
            {{ item.datePreference | beautifyDateTime }}
          </template>

          <template #item.actions="{ item }">
            <v-row class="mx-0 py-0 mt-n6 mb-n6">
              <v-col cols="6">
                <v-btn
                  class="mx-0 px-0"
                  color="transparent"
                  title="Edit"
                  @click="showEditDialog(item)"
                >
                  <v-icon
                    class="mx-0 px-0"
                    color="blue"
                    >mdi-pencil</v-icon
                  >
                </v-btn>
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
import { isNil } from "lodash"
import { onMounted, ref, computed, toRefs, watch } from "vue"
import { useRoute } from "vue2-helpers/vue-router"

import { TRAVEL_DESK_URL } from "@/urls"
import { securePost } from "@/store/jwt"

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

// TODO: Remove once dependent components are standardized
onMounted(async () => {
  await initForm()
})

async function initForm() {
  const flightRequest = {}
  flightRequest.id = null
  flightRequest.tmpId = null

  flightRequest.departLocation = ""
  flightRequest.arriveLocation = ""
  flightRequest.datePreference = ""
  flightRequest.timePreference = ""
  flightRequest.seatPreference = ""
  flightRequest.flightOptions = []

  flightRequest.value = flightRequest
}

async function removeFlight(item) {
  // console.log(item)
  let delIndex = -1
  if (item.id > 0)
    delIndex = travelDeskFlightRequests.value.findIndex(
      (flight) => flight.id && flight.id == item.id
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
