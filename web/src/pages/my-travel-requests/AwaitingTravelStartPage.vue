<template>
  <v-card>
    <v-card-title>
      <h2>Awaiting Travel Start</h2>
    </v-card-title>

    <v-card-text>
      <p>Waiting for the following conditions to be met:</p>
      <ul>
        <li v-if="isInPreExpensingStates"><p>Travel authorization to be approved.</p></li>
        <li v-if="isBeforeTravelStartDate"><p>Departue date to have passed.</p></li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, toRefs } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useTravelAuthorization, {
  STATUSES as TRAVEL_AUTHORIZATION_STATUSES,
} from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const isInPreExpensingStates =
  travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT ||
  travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED
const isBeforeTravelStartDate = computed(() => {
  const firstTravelSegment = travelAuthorization.value.travelSegments[0]
  if (isNil(firstTravelSegment)) return false

  return new Date(firstTravelSegment.departureOn) > new Date()
})

const breadcrumbs = computed(() => [
  {
    text: "My Travel Requests",
    to: {
      name: "my-travel-requests/MyTravelRequestsPage",
    },
  },
  {
    text: travelAuthorization.value?.eventName || "loading ...",
    to: {
      name: "my-travel-requests/request/RequestPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
])
useBreadcrumbs(breadcrumbs)
</script>
