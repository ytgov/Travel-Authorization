<template>
  <v-container class="px-0 px-md-6">
    <v-skeleton-loader
      v-if="isNil(travelDeskTravelRequestId) && !isErrored"
      type="card"
    />
    <v-alert
      v-else-if="isErrored"
      type="error"
    >
      Failed to fetch travel desk travel request.
    </v-alert>

    <TravelDeskTravelRequestCard
      v-else
      :travel-desk-travel-request-id="travelDeskTravelRequestId"
    />
  </v-container>
</template>

<script setup>
import { isNil } from "lodash"
import { computed } from "vue"

import useTravelDeskTravelRequests from "@/use/use-travel-desk-travel-requests"

import TravelDeskTravelRequestCard from "@/components/travel-desk-travel-requests/TravelDeskTravelRequestCard.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

// TODO: Consider loading travelAuthorization and pulling travelDeskTravel request from there.
const travelDeskTravelRequestQueryOptions = computed(() => ({
  where: {
    travelAuthorizationId: travelAuthorizationIdAsNumber.value,
  },
  perPage: 1,
}))
const { travelDeskTravelRequests, isErrored } = useTravelDeskTravelRequests(
  travelDeskTravelRequestQueryOptions
)

const travelDeskTravelRequest = computed(() => {
  return travelDeskTravelRequests.value[0]
})

const travelDeskTravelRequestId = computed(() => {
  return travelDeskTravelRequest.value?.id
})
</script>
