<template>
  <v-card
    class="card--outlined"
    :loading="isLoading"
  >
    <v-card-title>
      <h4>Options</h4>
    </v-card-title>
    <v-card-text class="d-flex flex-column gap-6 px-0 px-md-4">
      <TravelDeskFlightOptionPreferenceOrderCard
        v-for="(travelDeskFlightRequest, index) in travelDeskFlightRequests"
        :key="travelDeskFlightRequest.id"
        :title="`Leg ${index + 1}`"
        :subtitle="buildFlightRequestDescription(travelDeskFlightRequest)"
        :travel-desk-flight-request-id="travelDeskFlightRequest.id"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { isNil } from "lodash"

import formatDate from "@/utils/format-date"
import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"

import TravelDeskFlightOptionPreferenceOrderCard from "@/components/travel-desk-flight-options/TravelDeskFlightOptionPreferenceOrderCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const travelDeskFlightRequestsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskFlightRequests, isLoading } = useTravelDeskFlightRequests(
  travelDeskFlightRequestsQuery
)

/** @typedef {import('@/api/travel-desk-flight-requests-api.js').TravelDeskFlightRequest} TravelDeskFlightRequest */

/**
 * @param travelDeskFlightRequest {TravelDeskFlightRequest}
 */
function buildFlightRequestDescription(travelDeskFlightRequest) {
  if (isNil(travelDeskFlightRequest)) return "..."

  const { departLocation, arriveLocation, datePreference } = travelDeskFlightRequest
  const formattedDate = formatDate(datePreference)
  return `${departLocation} -> ${arriveLocation} @ ${formattedDate}`
}
</script>

<style scoped>
.gap-6 {
  gap: 1.5rem; /* 24px */
}
</style>
