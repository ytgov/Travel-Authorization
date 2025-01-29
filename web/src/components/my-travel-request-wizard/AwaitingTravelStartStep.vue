<template>
  <v-card>
    <v-card-title>
      <h2>Awaiting Travel Start</h2>
    </v-card-title>

    <v-card-text>
      <p>Waiting for the following conditions to be met:</p>
      <ul>
        <li v-if="isInPreExpensingStates"><p>Travel authorization to be approved.</p></li>
        <li v-if="isBeforeTravelStartDate"><p>Departure date to have passed.</p></li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, nextTick, toRefs } from "vue"
import { isNil } from "lodash"

import useSnack from "@/use/use-snack"
import useTravelAuthorization, {
  STATUSES as TRAVEL_AUTHORIZATION_STATUSES,
} from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, refresh } = useTravelAuthorization(travelAuthorizationId)

const isInPreExpensingStates = computed(() => {
  return (
    travelAuthorization.value?.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT ||
    travelAuthorization.value?.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED
  )
})

const isBeforeTravelStartDate = computed(() => {
  const firstTravelSegment = travelAuthorization.value?.travelSegments?.[0]
  if (isNil(firstTravelSegment)) return false

  return new Date(firstTravelSegment.departureOn) > new Date()
})

const canContinue = computed(() => {
  return !isInPreExpensingStates.value && !isBeforeTravelStartDate.value
})

async function initialize(context) {
  context.setEditableSteps([])
}

const snack = useSnack()

async function checkTravelStartStatus() {
  try {
    await refresh()

    await nextTick()
    if (canContinue.value) {
      snack.info("Travel has started!")
      return true
    }

    if (isInPreExpensingStates.value) {
      snack.warning("Travel authorization needs to be approved first.")
    } else if (isBeforeTravelStartDate.value) {
      snack.warning("Travel has not started yet.")
    }
    return false
  } catch (error) {
    console.error(`Error checking travel start status: ${error}`)
    snack.error(`Error checking travel start status: ${error}`)
    return false
  }
}

defineExpose({
  initialize,
  continue: checkTravelStartStatus,
})
</script>
