<template>
  <v-card>
    <v-card-title>
      <h2>Awaiting Flight Options</h2>
    </v-card-title>

    <v-card-text>
      <p>
        You have submitted a travel desk request and are awaiting travel options from the travel
        desk.
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
    TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.OPTIONS_PROVIDED
  )
})

async function initialize(context) {
  context.setEditableSteps(["review-request-details"])
}

const snack = useSnack()

async function checkForFlightOptions() {
  if (hasFlightOptions.value) return true

  try {
    await refresh()

    await nextTick()
    if (hasFlightOptions.value) {
      snack.info("Flight options received!")
      return true
    }

    snack.warning("No flight options yet.")
    return false
  } catch (error) {
    console.error(`Errored while checking for flight options: ${error}`)
    snack.error(`Errored while checking for flight options: ${error}`)
    return false
  }
}

defineExpose({
  initialize,
  continue: checkForFlightOptions,
})
</script>
