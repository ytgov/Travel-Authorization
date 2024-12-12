<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="card"
  />
  <TravelDeskFlightSegmentAttributesCard
    v-else
    :travel-desk-flight-segment-attributes="travelDeskFlightSegment"
  />
</template>

<script setup>
import { toRefs } from "vue"

import useTravelDeskFlightSegment from "@/use/use-travel-desk-flight-segment"
import TravelDeskFlightSegmentAttributesCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentAttributesCard.vue"

const props = defineProps({
  travelDeskFlightSegmentId: {
    type: Number,
    required: true,
  },
})

const { travelDeskFlightSegmentId } = toRefs(props)
const { travelDeskFlightSegment, isLoading } = useTravelDeskFlightSegment(travelDeskFlightSegmentId)
</script>

<style scoped></style>
