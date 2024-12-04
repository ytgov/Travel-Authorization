<template>
  <div>
    <v-card
      class="mt-5"
      large-title
    >
      <v-card-title>
        <h4>Segments</h4>
      </v-card-title>
      <v-card-text>
        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            @click="addFlightSegmentAttributes"
            >Add New Flight Segment
          </v-btn>
        </div>
        <v-data-iterator
          v-model="selectedSegments"
          :items="travelDeskFlightSegmentsAttributes"
          :items-per-page="-1"
          show-select
        >
          <template #item="{ item, isSelected, select }">
            <div class="d-flex align-center">
              <v-checkbox
                :value="isSelected"
                color="primary"
                @change="select"
              />
              <TravelDeskFlightSegmentEditCard
                class="mx-4 my-8"
                :flight-segment="item"
                @update:flightSegment="updateFlightSegment"
              />
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

function updateFlightSegment(flightSegment) {
  alert("TODO: build flight segment update")
}

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
  emit("update", [flightSegmentAttributes, ...props.value])
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
