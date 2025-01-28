<template>
  <v-card>
    <v-card-title>
      <h2>Awaiting Booking</h2>
    </v-card-title>

    <v-card-text>
      <p>
        You have ranked your flight options and are waiting to hear back from the travel desk about
        your booking confirmation or follow-up.
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, nextTick, toRefs } from "vue"

import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"

import useSnack from "@/use/use-snack"
import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, refresh } = useTravelAuthorization(travelAuthorizationId)

const hasFlightOptions = computed(() => {
  return (
    travelAuthorization.value?.travelDeskTravelRequest?.status ===
    TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.BOOKED
  )
})

async function initialize(context) {
  context.setEditableSteps([])
}

const snack = useSnack()

async function checkForFlightOptions() {
  try {
    await refresh()

    await nextTick()
    if (hasFlightOptions.value) {
      snack.info("Flight bookings confirmed!")
      return true
    }

    snack.warning("No flights booked yet.")
    return false
  } catch (error) {
    console.error(`Errored while checking booking status: ${error}`)
    snack.error(`Errored while checking booking status: ${error}`)
    return false
  }
}

defineExpose({
  initialize,
  continue: checkForFlightOptions,
})
</script>
