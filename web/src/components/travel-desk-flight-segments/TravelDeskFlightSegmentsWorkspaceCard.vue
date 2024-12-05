<template>
  <div>
    <v-card
      class="mt-5"
      large-title
    >
      <v-card-title class="d-flex flex-column flex-md-row justify-space-between align-center">
        <h4>Segments</h4>
        <v-btn
          class="my-0"
          color="primary"
          @click="addFlightSegmentAttributes"
          >Add Flight Segment
        </v-btn>
      </v-card-title>
      <v-card-text class="px-0 px-md-4">
        <v-data-iterator
          v-model="selectedSegments"
          :items="travelDeskFlightSegmentsAttributesWithId"
          :items-per-page="-1"
          show-select
        >
          <template #default="{ items, isSelected, select }">
            <div class="d-flex justify-center justify-md-start">
              <v-checkbox
                label="Select All"
                :input-value="selectAllValue"
                :indeterminate="selectAllValue === null"
                @change="selectAll"
              />
            </div>
            <div
              v-for="(item, index) in items"
              :key="item.id"
              class="d-flex flex-column flex-md-row align-center"
            >
              <v-checkbox
                :input-value="isSelected(item)"
                color="primary"
                @change="($event) => select(item, $event)"
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
      <v-card-actions class="d-flex flex-column flex-md-row justify-space-between">
        <v-btn
          :disabled="selectedSegments.length == 0"
          color="red"
          @click="deleteSelectedFlightSegments"
          >Delete Selected
        </v-btn>
        <v-btn
          :disabled="selectedSegments.length == 0"
          color="primary"
          @click="groupFlightSegmentsAsFlightOption"
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
import { cloneDeep, isEmpty, isEqual } from "lodash"

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

const emit = defineEmits(["update", "buildFlightOption"])

const travelDeskFlightSegmentsAttributesWithId = computed(() =>
  props.travelDeskFlightSegmentsAttributes.map((segment, index) => ({
    id: index,
    ...segment,
  }))
)

const selectedSegments = ref([])

const selectAllValue = computed(() => {
  if (
    !isEmpty(selectedSegments.value) &&
    selectedSegments.value.length === travelDeskFlightSegmentsAttributesWithId.value.length
  ) {
    return true
  } else if (isEmpty(selectedSegments.value)) {
    return false
  } else {
    return null
  }
})

function selectAll(value) {
  if (value === true && !isEmpty(selectedSegments.value)) {
    selectedSegments.value = []
  } else if (value === false) {
    selectedSegments.value = []
  } else {
    selectedSegments.value = cloneDeep(travelDeskFlightSegmentsAttributesWithId.value)
  }
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

function groupFlightSegmentsAsFlightOption() {
  const { id, ...flightSegmentAttributesWithoutId } = selectedSegments.value
  let durationHours = 0
  let durationMinutes = 0
  let sortOrder = 1
  for (const flightSegmentAttributes of flightSegmentAttributesWithoutId) {
    flightSegmentAttributes.sortOrder = sortOrder
    sortOrder += 1
    const duration = extractDuration(flightSegmentAttributes.duration)
    durationHours += Number(duration.hours)
    durationMinutes += Number(duration.minutes)
  }

  const flightOptionAttributes = {
    cost: "",
    leg: "",
    flightPreferenceOrder: null,
    // TODO: consider making duration a value in seconds?
    duration: durationHours + " Hour(s) " + durationMinutes + " Minute(s)",
    flightSegmentAttributes: flightSegmentAttributesWithoutId,
  }
  emit("buildFlightOption", flightOptionAttributes)
  selectedSegments.value = []
}

function extractDuration(duration) {
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
