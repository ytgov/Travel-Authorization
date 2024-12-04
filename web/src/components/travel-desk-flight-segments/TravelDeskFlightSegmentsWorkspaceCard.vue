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
          :items="travelDeskFlightSegmentsAttributesWithId"
          :items-per-page="-1"
          show-select
        >
          <template #item="{ index, item, select, isSelected }">
            <div class="d-flex align-center">
              <v-checkbox
                :value="isSelected"
                color="primary"
                @change="select"
              />
              <TravelDeskFlightSegmentEditCard
                :flight-segment="item"
                @update:flightSegment="updateFlightSegment($event, index)"
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
          @click="deleteSelectedFlightSegments"
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
import { computed, ref } from "vue"
import { cloneDeep, isEqual } from "lodash"

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

const travelDeskFlightSegmentsAttributesWithId = computed(() =>
  props.travelDeskFlightSegmentsAttributes.map((segment, index) => ({
    id: index,
    ...segment,
  }))
)

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
    sortOrder: props.travelDeskFlightSegmentsAttributes.length + 1,
  }
  emit("update", [flightSegmentAttributes, ...props.travelDeskFlightSegmentsAttributes])
}

function updateFlightSegment(newFlightSegment, index) {
  const newFlightSegments = cloneDeep(props.travelDeskFlightSegmentsAttributes)
  const { id, ...newFlightSegmentWithoutId } = newFlightSegment
  newFlightSegments[index] = newFlightSegmentWithoutId
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

function deleteSelectedFlightSegments() {
  const newFlightSegments = cloneDeep(props.travelDeskFlightSegmentsAttributes)
  for (const { id, ...selectedSegmentWithoutId } of selectedSegments.value) {
    const indexOfItemToRemove = newFlightSegments.findIndex((segment) =>
      isEqual(segment, selectedSegmentWithoutId)
    )
    if (indexOfItemToRemove >= 0) {
      newFlightSegments.splice(indexOfItemToRemove, 1)
    }
  }

  emit("update", newFlightSegments)
  selectedSegments.value = []
}
</script>

<style scoped>
::v-deep table tbody td {
  border: 0px solid white !important;
  background-color: #ffffff !important;
}
</style>
