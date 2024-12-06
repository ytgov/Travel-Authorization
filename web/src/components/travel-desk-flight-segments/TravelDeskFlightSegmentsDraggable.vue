<template>
  <Draggable
    v-model="travelDeskFlightSegments"
    handle=".handle"
    group="flight-segments"
    @change="reOrderFlightSegments(travelDeskFlightSegments, $event)"
    @input="reOrderAlternative"
  >
    <transition-group>
      <v-row
        v-for="(segment, flightSegmentIndex) in travelDeskFlightSegments"
        :key="'group-' + segment.id + '-' + flightSegmentIndex"
        class="mb-5 rounded border-sm border-surface-variant border-opacity-100"
      >
        <v-col class="pa-2">
          <div class="d-flex justify-center flex-column flex-md-row">
            <div
              class="handle flex-grow-1 d-flex justify-end align-center"
              style="cursor: move"
            >
              <v-progress-circular
                v-if="isReOrdering"
                indeterminate
              />
              <v-icon
                v-else
                size="large"
                class="mr-2"
                >mdi-reorder-horizontal</v-icon
              >
            </div>
            <v-divider
              vertical
              class="mr-4"
            />
            <TravelDeskFlightSegmentCard
              class="flex-grow-1 mr-4 mb-2"
              :travel-desk-flight-segment-id="segment.id"
            />
          </div>
        </v-col>
      </v-row>
    </transition-group>
  </Draggable>
</template>

<script setup>
import { computed, ref } from "vue"
import { cloneDeep, isNil } from "lodash"

import useTravelDeskFlightSegments from "@/use/use-travel-desk-flight-segments"

import Draggable from "vuedraggable"
import TravelDeskFlightSegmentCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentCard.vue"

/** @typedef {import('@/api/travel-desk-flight-segments-api.js').TravelDeskFlightSegmentWhereOptions} TravelDeskFlightSegmentWhereOptions */

/**
 * @type {{
 *   where: TravelDeskFlightSegmentWhereOptions
 * }}
 */
const props = defineProps({
  where: {
    type: Object,
    default: () => ({}),
  },
})

const travelDeskFlightSegmentsQuery = computed(() => ({
  where: props.where,
}))
const { travelDeskFlightSegments } = useTravelDeskFlightSegments(travelDeskFlightSegmentsQuery)

const isReOrdering = ref(false)

/**
 * Reorders the flight segments based on the provided parameters.
 * @param {Array} flightSegments - The array of flight segments to be reordered.
 * @param {{
 *   moved: {
 *     element: Object
 *     oldIndex: number
 *     newIndex: number
 *   }
 *   added: {
 *     element: Object
 *     newIndex: number
 *   }
 *   removed: {
 *     element: Object
 *     oldIndex: number
 *   }
 * }} changeEvent - The parameters containing the moved, added, and removed segments.
 */
async function reOrderFlightSegments(flightSegments, { moved, added, removed }) {
  isReOrdering.value = true

  // const newFlightSegments = cloneDeep(flightSegments)
  // if (!isNil(moved)) {
  //   const [movedSegment] = newFlightSegments.splice(moved.oldIndex, 1)
  //   newFlightSegments.splice(moved.newIndex, 0, movedSegment)
  // }

  // console.log(`newFlightSegments:`, JSON.stringify(newFlightSegments, null, 2))
  // console.log(`moved:`, moved)
  // console.log(`added:`, added)
  // console.log(`removed:`, removed)
  isReOrdering.value = false
}

function reOrderAlternative(flightSegments) {
  // can be used for reordering
  console.log(`reOrderAlternative -> flightSegments:`, JSON.stringify(flightSegments, null, 2))
}
</script>
