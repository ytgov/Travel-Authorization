<template>
  <v-tooltip
    v-if="isLocked"
    bottom
  >
    <template #activator="{ on }">
      <div
        class="d-flex align-center"
        v-on="on"
      >
        <v-tab
          class="d-flex align-start"
          disabled
        >
          Request
          <v-icon
            class="ml-1"
            small
          >
            mdi-help-circle-outline
          </v-icon>
        </v-tab>
      </div>
    </template>
    <span v-if="hasNoAirTravel"> Disabled as traveler is not traveling by air.</span>
    <span v-else-if="isWaitingForApproval"> Locked until request is approved. </span>
  </v-tooltip>
  <!--
    TODO: add page for different travel request states
    e.g.
      - only show edit page when travelDeskTravelRequest.status === TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.DRAFT
      - when status SUBMITTED, show a read-only page, etc.
   -->
  <v-tab
    v-else
    :to="{
      name: componentName,
      params: { travelAuthorizationId },
    }"
  >
    Request
  </v-tab>
</template>

<script setup>
import { computed, toRefs } from "vue"

import { TRAVEL_METHODS } from "@/api/travel-segments-api"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"
import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, STATUSES, refresh } = useTravelAuthorization(travelAuthorizationId)
// TODO: lock on denied states.
const isWaitingForApproval = computed(
  () =>
    travelAuthorization.value.status === STATUSES.DRAFT ||
    travelAuthorization.value.status === STATUSES.SUBMITTED
)
const hasNoAirTravel = computed(() =>
  travelAuthorization.value.travelSegments.every(
    (segment) => segment.modeOfTransport !== TRAVEL_METHODS.AIRCRAFT
  )
)
const isLocked = computed(() => isWaitingForApproval.value || hasNoAirTravel.value)

// TODO: this will likely a different page for each travel desk travel request status.
const componentName = computed(() => {
  if (
    travelAuthorization.value?.travelDeskTravelRequest?.status ===
    TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.DRAFT
  ) {
    return "MyTravelRequestsRequestEditPage"
  } else {
    return "MyTravelRequestsRequestReadPage"
  }
})

defineExpose({
  refresh,
})
</script>
