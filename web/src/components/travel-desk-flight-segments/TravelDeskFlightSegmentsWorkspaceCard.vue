<template>
  <div>
    <v-card
      class="mt-5"
      large-title
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <h4>Segments</h4>
        <v-btn
          class="my-0"
          color="primary"
          @click="addFlightSegmentAttributes"
          >Add New Flight Segment
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-iterator
          v-model="selectedSegments"
          :items="travelDeskFlightSegmentsAttributes"
          :items-per-page="-1"
          show-select
        >
          <template #item="{ index, item, isSelected, select }">
            <div class="d-flex align-center">
              <v-checkbox
                :value="isSelected"
                color="primary"
                @change="select(item)"
              />
              <TravelDeskFlightSegmentEditCard
                :flight-segment="item"
                @update:flightSegment="($event) => updateFlightSegment(item, index)"
              />
              <v-btn
                class="ml-2"
                color="error"
                title="Delete"
                icon
                @click="deleteFlightSegment(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-iterator>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="selectedSegments.length == 0"
          color="red"
          @click="removeFlightSegments"
          >Delete Selected
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="selectedSegments.length == 0"
          color="primary"
          @click="groupFlightSegments"
        >
          Group Selected
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  model: {
    prop: "travelDeskFlightSegmentsAttributes",
    event: "update",
  },
}
</script>

<script setup>
import { ref } from "vue"
import { cloneDeep } from "lodash"

import TravelDeskFlightSegmentEditCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentEditCard.vue"

const props = defineProps({
  travelDeskFlightSegmentsAttributes: {
    type: Array,
    default: () => [],
  },
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["update", "update:flightOption"])

const selectedSegments = ref([])

function addFlightSegmentAttributes() {
  const flightSegmentAttributes = {
    flightNumber: "",
    departAt: "",
    departDay: "",
    departTime: "",
    departLocation: "",
    arriveAt: "",
    arriveDay: "",
    arriveTime: "",
    arriveLocation: "",
    duration: "",
    status: "",
    class: "",
    sortOrder: 1,
  }
  emit("update", [flightSegmentAttributes, ...props.travelDeskFlightSegmentsAttributes])
}

function updateFlightSegment(newFlightSegment, index) {
  console.log(`newFlightSegment:`, JSON.stringify(newFlightSegment, null, 2))
  const newFlightSegments = cloneDeep(props.travelDeskFlightSegmentsAttributes)
  console.log(`newFlightSegments:`, JSON.stringify(newFlightSegments, null, 2))
  newFlightSegments[index] = newFlightSegment
  console.log(`newFlightSegments:`, JSON.stringify(newFlightSegments, null, 2))
  emit("update", newFlightSegments)
}

function deleteFlightSegment(index) {
  const newFlightSegments = cloneDeep(props.travelDeskFlightSegmentsAttributes)
  newFlightSegments.splice(index, 1)
  emit("update", newFlightSegments)
}

function groupFlightSegments() {
  let durationHours = 0
  let durationMinutes = 0
  let sortOrder = 1
  for (const segment of selectedSegments.value) {
    segment.sortOrder = sortOrder
    sortOrder++
    const duration = extractDuration(segment.duration)
    durationHours += Number(duration.hours)
    durationMinutes += Number(duration.minutes)
  }

  const flightOption = {
    cost: "",
    leg: "",
    state: { costErr: false },
    flightPreferenceOrder: null,
    duration: durationHours + " Hour(s) " + durationMinutes + " Minute(s)",
    flightSegments: cloneDeep(selectedSegments.value),
  }
  emit("update:flightOption", flightOption)

  selectedSegments.value = []
}

function extractDuration(duration) {
  // console.log(duration.match(/\d+/g))
  let hours = 0
  let minutes = 0
  const time = duration.match(/\d+/g)
  if (time?.length == 2) {
    hours = time[0]
    minutes = time[1]
  } else if (time?.length == 1) {
    minutes = duration.includes("m") || duration.includes("M") ? time[0] : 0
    hours = duration.includes("h") || duration.includes("H") ? time[0] : 0
  }

  return { hours: hours, minutes: minutes }
}

function removeFlightSegments() {
  for (const selectedSegment of this.selectedSegments) {
    const delIndex = this.flightSegments.findIndex(
      (segment) => segment.tmpId == selectedSegment.tmpId
    )
    if (delIndex >= 0) this.flightSegments.splice(delIndex, 1)
  }
  this.selectedSegments.splice(0)
}
</script>

<style scoped>
::v-deep table tbody td {
  border: 0px solid white !important;
  background-color: #ffffff !important;
}
</style>
