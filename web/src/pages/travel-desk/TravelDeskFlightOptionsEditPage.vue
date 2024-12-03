<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <h2>Manage Groups/Flight Options</h2>
        <v-btn
          color="secondary"
          :loading="isLoading"
          @click="closeModal"
        >
          Back
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row class="mt-5">
          <v-col>
            <TravelDeskFlightSegmentsImporterCard @imported="refresh" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="mt-5">
              <v-card-title><h3>Cost and Group Segments</h3></v-card-title>
              <v-card-text>
                <FlightSegmentsTable
                  :flight-segments="flightSegments"
                  :flight-options="travelDeskFlightOptions"
                  :flight-text="flightText"
                  class="mx-2 mt-10"
                  @cleanPortText="rawPortalText = ''"
                />
                <FlightOptionsTable
                  :legs="legs"
                  :ungrouped-flight-segments="flightSegments"
                  :flight-options="travelDeskFlightOptions"
                  style="margin: 7rem 0.5rem 2rem 0.5rem"
                />
                <v-card-actions>
                  <v-btn
                    class="ml-3 mr-2 my-5 px-3 py-4"
                    style="min-width: 0"
                    color="grey darken-1"
                    :loading="isLoading"
                    small
                    @click="closeModal"
                    >Close
                  </v-btn>
                  <v-btn
                    style="min-width: 0"
                    color="red"
                    class="ml-3 my-5 px-3 py-4"
                    :loading="isLoading"
                    small
                    @click="deleteFlightOptions(true)"
                    >Delete Travel Port Record
                  </v-btn>
                  <v-btn
                    :disabled="travelDeskFlightOptions.length == 0"
                    style="min-width: 0"
                    color="secondary"
                    class="ml-auto mr-3 my-5 px-3 py-4"
                    :loading="isLoading"
                    small
                    @click="removeAllFlightOptions"
                    >Remove All Groups
                  </v-btn>
                  <v-btn
                    :disabled="travelDeskFlightOptions.length == 0"
                    style="min-width: 0"
                    color="#005A65"
                    class="ml-3 mr-3 my-5 px-3 py-4"
                    :loading="isLoading"
                    small
                    @click="saveAllFlightOptions"
                    >Save Groupings
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import Vue, { computed, ref } from "vue"

import { TRAVEL_DESK_URL } from "@/urls"
import http from "@/api/http-client"

import useTravelDeskFlightOptions from "@/use/use-travel-desk-flight-options"

import FlightSegmentsTable from "@/modules/travelDesk/views/Desk/Components/FlightSegmentsTable.vue"
import FlightOptionsTable from "@/modules/travelDesk/views/Desk/Components/FlightOptionsTable.vue"
import TravelDeskFlightSegmentsImporterCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsImporterCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: [String, Number],
    required: true,
  },
  travelDeskFlightRequestId: {
    type: [String, Number],
    required: true,
  },
})

const travelDeskFlightOptionsQuery = computed(() => ({
  where: {
    flightRequestId: props.travelDeskFlightRequestId,
  },
}))
const { travelDeskFlightOptions, totalCount, isLoading, refresh } = useTravelDeskFlightOptions(
  travelDeskFlightOptionsQuery
)

const rawPortalText = ref("")
const flightText = ref({})
const flightSegments = ref([])
const legs = ref([])

function initForm() {
  flightSegments.value = []
  travelDeskFlightOptions.value = []
  legs.value = []

  for (const flightRequest of flightRequests.value) {
    travelDeskFlightOptions.value.push(...(flightRequest.flightOptions || []))
    // console.log(flightRequest)
    legs.value.push({
      flightRequestId: flightRequest.id,
      text: getFlightRequestTxt(flightRequest),
    })
  }
}

function getFlightRequestTxt(flightRequest) {
  return (
    flightRequest.departLocation +
    " -> " +
    flightRequest.arriveLocation +
    " @ " +
    Vue.filter("beautifyDate")(flightRequest.datePreference)
  )
}
function checkStates() {
  let complete = true

  for (const flightOption of travelDeskFlightOptions.value) {
    flightOption.state = flightOption.state || {}
    flightOption.state.costErr = flightOption.cost ? false : true
    flightOption.state.legErr = flightOption.flightRequestId ? false : true
    if (flightOption.state.costErr || flightOption.state.legErr) complete = false
  }
  return complete
}

function deleteFlightOptions(removeSegments) {
  isLoading.value = true
  return http
    .delete(`${TRAVEL_DESK_URL}/flight-options/${travelDeskTravelRequestId.value}`)
    .then((resp) => {
      console.log(resp)
      travelDeskFlightOptions.value.splice(0)
      if (removeSegments) flightSegments.value = []
      isLoading.value = false
    })
    .catch((e) => {
      console.log(e)
      isLoading.value = false
    })
}

function removeAllFlightOptions() {
  for (const flightOption of travelDeskFlightOptions.value) {
    for (const flightSegment of flightOption.flightSegments) {
      flightSegments.value.push(flightSegment)
    }
  }
  travelDeskFlightOptions.value.splice(0)
  deleteFlightOptions(false)
}

function saveAllFlightOptions() {
  console.log("HERE", checkStates())

  if (checkStates()) {
    isLoading.value = true
    const body = travelDeskFlightOptions.value

    return http
      .post(`${TRAVEL_DESK_URL}/flight-options/${travelDeskTravelRequestId.value}`, body)
      .then((resp) => {
        console.log(resp)
        isLoading.value = false
        closeModal()
      })
      .catch((e) => {
        console.log(e)
        isLoading.value = false
      })
  }
}

function closeModal() {
  emit("close")
  travelPortDialog.value = false
}
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
