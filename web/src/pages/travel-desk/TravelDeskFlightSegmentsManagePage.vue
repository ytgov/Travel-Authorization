<template>
  <v-container class="mx-0 mx-md-auto px-0 px-md-4">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <h2>Manage Groups/Flight Options</h2>
        <v-btn
          :to="{
            name: 'TravelDeskEditPage',
            params: {
              travelDeskTravelRequestId,
            },
          }"
          :loading="isLoading"
          color="secondary"
        >
          Back
        </v-btn>
      </v-card-title>
      <v-card-text class="px-0 px-md-4">
        <v-row class="mt-5">
          <v-col>
            <TravelDeskFlightSegmentsImporterCard @imported="appendFlightSegmentsAttributes" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="mt-5">
              <v-card-title><h3>Cost and Group Segments</h3></v-card-title>
              <v-card-text class="px-0 px-md-4">
                <TravelDeskFlightSegmentsWorkspaceCard
                  v-model="travelDeskFlightSegmentsAttributes"
                  :travel-desk-travel-request-id="travelDeskTravelRequestIdAsNumber"
                  @buildFlightOption="appendFlightOptionAttributes"
                />
                <FlightOptionsTable
                  :legs="legs"
                  :ungrouped-flight-segments="travelDeskFlightSegmentsAttributes"
                  :flight-options="travelDeskFlightOptions"
                  style="margin: 7rem 0.5rem 2rem 0.5rem"
                />
                <v-card-actions>
                  <v-btn
                    :to="{
                      name: 'TravelDeskEditPage',
                      params: {
                        travelDeskTravelRequestId,
                      },
                    }"
                    class="ml-3 mr-2 my-5 px-3 py-4"
                    style="min-width: 0"
                    color="grey darken-1"
                    :loading="isLoading"
                    small
                    >Back
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
import { computed, ref } from "vue"
import { flatMap, isNil } from "lodash"

import { TRAVEL_DESK_URL } from "@/urls"
import http from "@/api/http-client"

import formatDate from "@/utils/format-date"
import useSnack from "@/use/use-snack"
import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"

import FlightOptionsTable from "@/modules/travelDesk/views/Desk/Components/FlightOptionsTable.vue"
import TravelDeskFlightSegmentsImporterCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsImporterCard.vue"
import TravelDeskFlightSegmentsWorkspaceCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsWorkspaceCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: [String, Number],
    required: true,
  },
})

const travelDeskTravelRequestIdAsNumber = computed(() => parseInt(props.travelDeskTravelRequestId))

const travelDeskFlightRequestsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskFlightRequests, isLoading } = useTravelDeskFlightRequests(
  travelDeskFlightRequestsQuery
)
const travelDeskFlightOptions = computed(() =>
  flatMap(travelDeskFlightRequests.value, "flightOptions")
)

const legs = computed(() =>
  travelDeskFlightRequests.value.map((travelDeskFlightRequest) => ({
    flightRequestId: travelDeskFlightRequest.id,
    text: buildFlightRequestDescription(travelDeskFlightRequest),
  }))
)

const travelDeskFlightSegmentsAttributes = ref([])
const travelDeskFlightOptionsAttributes = ref([])

function appendFlightSegmentsAttributes(newFlightSegmentsAttributes) {
  travelDeskFlightSegmentsAttributes.value = [
    ...travelDeskFlightSegmentsAttributes.value,
    ...newFlightSegmentsAttributes,
  ]
}

function appendFlightOptionAttributes(newFlightOptionAttributes) {
  travelDeskFlightOptionsAttributes.value = [
    ...travelDeskFlightOptionsAttributes.value,
    ...newFlightOptionAttributes,
  ]
}

function buildFlightRequestDescription(travelDeskFlightRequest) {
  if (isNil(travelDeskFlightRequest)) {
    return "..."
  }

  const { departLocation, arriveLocation, datePreference } = travelDeskFlightRequest
  const formattedDate = formatDate(datePreference)
  return `${departLocation} -> ${arriveLocation} @ ${formattedDate}`
}

const snack = useSnack()

function removeAllFlightOptions() {
  for (const flightOption of travelDeskFlightOptions.value) {
    for (const flightSegment of flightOption.flightSegments) {
      travelDeskFlightSegmentsAttributes.value.push(flightSegment)
    }
  }
  travelDeskFlightOptions.value.splice(0)
  deleteFlightOptions(false)
}

async function deleteFlightOptions(removeSegments) {
  isLoading.value = true
  try {
    await http.delete(`${TRAVEL_DESK_URL}/flight-options/${props.travelDeskTravelRequestId}`)

    travelDeskFlightOptions.value.splice(0)

    if (removeSegments) {
      travelDeskFlightSegmentsAttributes.value = []
    }
  } catch (error) {
    console.error(error)
    snack.error(`Failed to delete flight options: ${error}`)
  } finally {
    isLoading.value = false
  }
}

async function saveAllFlightOptions() {
  // TODO: validate using form ref

  isLoading.value = true
  try {
    const body = travelDeskFlightOptions.value
    await http.post(`${TRAVEL_DESK_URL}/flight-options/${props.travelDeskTravelRequestId}`, body)
  } catch (error) {
    console.error(error)
    snack.error(`Failed to save flight options: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
