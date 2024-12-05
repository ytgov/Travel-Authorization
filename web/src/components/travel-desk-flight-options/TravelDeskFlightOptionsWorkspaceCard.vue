<template>
  <v-card>
    <v-card-title>
      <h4>Flight Options Groupings</h4>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="flightOptions"
      :items-per-page="-1"
      :hide-default-footer="true"
      :hide-default-header="true"
    >
      <template #item.name="{ item, index }">
        <v-card
          :class="{
            'mt-5': index !== 0,
          }"
        >
          <v-card-title>
            <h5>Group {{ index + 1 }}</h5>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <TravelDeskFlightRequestSelect
                  v-model="item.flightRequestId"
                  label="Leg *"
                  :where="{
                    travelRequestId: travelDeskTravelRequestId,
                  }"
                  :rules="[required]"
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="2"
              >
                <v-text-field
                  v-model="item.cost"
                  label="Cost *"
                  type="number"
                  :rules="[required]"
                  prefix="$"
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="item.duration"
                  label="Travel Duration"
                  readonly
                  outlined
                  append-icon="mdi-lock"
                />
              </v-col>
            </v-row>
            <div
              v-for="(segment, flightSegmentIndex) in item.flightSegments"
              :key="'group-' + segment.id + '-' + flightSegmentIndex"
            >
              <v-row
                style="cursor: move"
                :draggable="true"
                @dragover.prevent
                @drop.prevent="drop(item, segment, flightSegmentIndex)"
                @dragstart="drag(segment, flightSegmentIndex)"
              >
                <v-col
                  cols="12"
                  md="1"
                  align-self="center"
                  class="d-flex justify-center"
                >
                  <v-icon color="primary">mdi-arrow-all</v-icon>
                </v-col>
                <v-col
                  cols="12"
                  md="11"
                >
                  <TravelDeskFlightSegmentCard
                    class="mr-4 mb-2"
                    :travel-desk-flight-segment-id="segment.id"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { nextTick, ref } from "vue"

import { required } from "@/utils/validators"

import TravelDeskFlightSegmentCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentCard.vue"
import TravelDeskFlightRequestSelect from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestSelect.vue"

defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  flightOptions: {
    type: Array,
    required: true,
  },
  ungroupedFlightSegments: {
    type: Array,
    required: true,
  },
})

const headers = ref([{ text: "", value: "name" }])
const source = ref({})
const sourceIndex = ref(-1)

function drag(source, index) {
  source.value = source
  sourceIndex.value = index
}

async function drop(flightOption, target, index) {
  if (sourceIndex.value != index) return

  const sortOrderTarget = target.sortOrder
  target.sortOrder = source.value.sortOrder
  source.value.sortOrder = sortOrderTarget

  await nextTick()
  sortByOrder(flightOption.flightSegments)
}

function sortByOrder(flight) {
  flight.sort((a, b) => {
    return a.sortOrder > b.sortOrder ? 1 : -1
  })
  return flight
}
</script>

<style scoped></style>
