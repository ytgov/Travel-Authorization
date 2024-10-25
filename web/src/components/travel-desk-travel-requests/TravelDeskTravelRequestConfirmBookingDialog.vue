<template>
  <v-dialog
    v-model="confirmBookingDialog"
    persistent
    width="30%"
  >
    <v-card :loading="isLoading">
      <v-card-title class="warning">
        <div class="text-h5">Confirm Booking is Complete</div>
      </v-card-title>
      <v-card-text>
        <p class="mt-5">
          Are you sure this booking is Complete?<br />
          Once a booking is completed, you can no longer make changes to it.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="grey darken-5"
          class="px-5"
          @click="close"
        >
          <div>Cancel</div>
        </v-btn>
        <v-btn
          class="mr-0 ml-auto px-5"
          color="#005A65"
          :loading="isSaving"
          @click="bookTravelRequest"
          >Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import { cloneDeep, isNil } from "lodash"

import { TRAVEL_DESK_URL } from "@/urls"
import { useSnack } from "@/plugins/snack-plugin"
import http from "@/api/http-client"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"
import useRouteQuery, { integerTransformer } from "@/use/use-route-query"

const emit = defineEmits({
  booked: null,
})

const confirmBookingDialog = ref(false)
const travelDeskTravelRequestId = useRouteQuery("showConfirmBooking", null, {
  mode: "push",
  transform: integerTransformer,
})

const travelDeskTravelRequest = ref(null)

const isLoading = ref(false)
const isSaving = ref(false)

const snack = useSnack()

async function fetchTravelDeskTravelRequest(travelDeskTravelRequestId) {
  isLoading.value = true
  try {
    const { data } = await http.get(
      `${TRAVEL_DESK_URL}/travel-request/${travelDeskTravelRequestId}`
    )
    travelDeskTravelRequest.value = data
    return data
  } catch (error) {
    console.log(error)
    snack.error(`Failed to load travel request: ${error}`)
  } finally {
    isLoading.value = false
  }
}

async function bookTravelRequest() {
  const body = cloneDeep(travelDeskTravelRequest.value)
  delete body.internationalTravel
  delete body.differentTravelContact
  delete body.office
  delete body.department
  delete body.fullName

  // TODO: move status updates to state specific endpoints
  body.status = TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.BOOKED

  isSaving.value = true
  try {
    await http.post(`${TRAVEL_DESK_URL}/travel-request/${body.id}`, body)
    snack.success("Travel request saved.")
    emit("booked")
    close()
  } catch (error) {
    console.error(error)
    snack.error(`Failed to save travel request: ${error}`)
  } finally {
    isSaving.value = false
  }
}

watch(
  travelDeskTravelRequestId,
  (newTravelDeskTravelRequestId) => {
    if (isNil(newTravelDeskTravelRequestId)) {
      confirmBookingDialog.value = false
    } else {
      confirmBookingDialog.value = true
      fetchTravelDeskTravelRequest(newTravelDeskTravelRequestId)
    }
  },
  {
    immediate: true,
  }
)

function open(newTravelDeskTravelRequestId) {
  travelDeskTravelRequestId.value = newTravelDeskTravelRequestId
}

function close() {
  travelDeskTravelRequestId.value = null
}

defineExpose({
  open,
})
</script>
