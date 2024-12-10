<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="card"
  />
  <v-col
    v-else
    class="d-flex flex-column gap-4"
  >
    <dl
      v-for="travelDeskFlightSegment in travelDeskFlightSegments"
      :key="travelDeskFlightSegment.id"
    >
      <DescriptionElement
        class="d-flex"
        label="Cost"
        :value="formatCurrency(cost)"
        horizontal
      />
      <DescriptionElement
        label="Airline"
        :value="travelDeskFlightSegment.flightNumber"
        horizontal
      />
      <DescriptionElement
        label="Departure"
        :value="departureFormatter(travelDeskFlightSegment)"
        horizontal
      />
      <DescriptionElement
        label="Arrival"
        :value="arrivalFormatter(travelDeskFlightSegment)"
        horizontal
      />
      <DescriptionElement
        label="Duration"
        :value="travelDeskFlightSegment.duration"
        horizontal
      />
    </dl>
  </v-col>
</template>

<script setup>
import { computed } from "vue"

import formatCurrency from "@/utils/format-currency"
import useTravelDeskFlightSegments from "@/use/use-travel-desk-flight-segments"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import formatDate from "@/utils/format-date"

const props = defineProps({
  travelDeskFlightOptionId: {
    type: Number,
    required: true,
  },
  cost: {
    type: [String, Number],
    required: true,
  },
})

const travelDeskFlightSegmentsQuery = computed(() => ({
  where: {
    flightOptionId: props.travelDeskFlightOptionId,
  },
}))

const { travelDeskFlightSegments, isLoading } = useTravelDeskFlightSegments(
  travelDeskFlightSegmentsQuery
)

function departureFormatter(travelDeskFlightSegment) {
  const { departAt, departLocation } = travelDeskFlightSegment
  const formattedDate = formatDate(departAt)

  return `${formattedDate} ${departLocation}`
}

function arrivalFormatter(travelDeskFlightSegment) {
  const { arriveAt, arriveLocation } = travelDeskFlightSegment
  const formattedDate = formatDate(arriveAt)

  return `${formattedDate} ${arriveLocation}`
}
</script>

<style scoped>
.gap-4 {
  gap: 1rem; /* 16px */
}
</style>
