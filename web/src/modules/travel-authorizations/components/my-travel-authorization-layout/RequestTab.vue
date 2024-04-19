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
  <v-tab
    v-else
    :to="{
      name: 'MyTravelRequestsRequestEditPage',
      params: { travelAuthorizationId },
    }"
  >
    Request
  </v-tab>
</template>

<script setup>
import { computed, toRefs } from "vue"

import { TRAVEL_METHODS } from "@/api/travel-segments-api"
import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, STATUSES } = useTravelAuthorization(travelAuthorizationId)
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
</script>
