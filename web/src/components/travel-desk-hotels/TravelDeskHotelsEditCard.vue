<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <h3>Hotel Requests</h3>
      <TravelDeskHotelCreateDialog
        :activator-props="{
          class: 'my-0',
        }"
        :travel-desk-travel-request-id="travelDeskTravelRequestId"
        :min-date="minDate"
        :max-date="maxDate"
        :flight-start="earliestFlightDate"
        :flight-end="latestFlightDate"
        @created="refreshTravelDeskHotels"
      />
    </v-card-title>
    <v-card-text>
      <TravelDeskHotelsDataTable
        ref="travelDeskHotelsDataTable"
        :where="whereClause"
      >
        <template #top>
          <TravelDeskHotelEditDialog
            ref="editDialog"
            :min-date="minDate"
            :max-date="maxDate"
            :flight-start="earliestFlightDate"
            :flight-end="latestFlightDate"
            @saved="refreshTravelDeskHotels"
          />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              title="Edit"
              icon
              color="blue"
              @click="showEditDialog(item)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-btn
              :loading="isLoading"
              title="Delete"
              icon
              color="red"
              @click="deleteHotel(item)"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </div>
        </template>
      </TravelDeskHotelsDataTable>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import travelDeskHotelsApi from "@/api/travel-desk-hotels-api"
import useTravelAuthorization from "@/use/use-travel-authorization"
import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"

import TravelDeskHotelCreateDialog from "@/components/travel-desk-hotels/TravelDeskHotelCreateDialog.vue"
import TravelDeskHotelEditDialog from "@/components/travel-desk-hotels/TravelDeskHotelEditDialog.vue"
import TravelDeskHotelsDataTable from "@/components/travel-desk-hotels/TravelDeskHotelsDataTable.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const whereClause = computed(() => ({
  travelRequestId: props.travelDeskTravelRequestId,
}))

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const minDate = computed(() => travelAuthorization.value?.startDate?.slice(0, 10))
const maxDate = computed(() => travelAuthorization.value?.endDate?.slice(0, 10))

// TODO: maybe make an optimized query that returns the start/end dates?
const travelDeskFlightRequestsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
  perPage: 1000,
}))
const {
  earliestFlightDate,
  latestFlightDate,
  refresh: refreshFlightRequests,
} = useTravelDeskFlightRequests(travelDeskFlightRequestsQuery)

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskHotelEditDialog> | null>} */
const editDialog = ref(null)

function showEditDialog(hotel) {
  editDialog.value?.show(hotel)
}

const isLoading = ref(false)
/** @type {import("vue").Ref<InstanceType<typeof TravelDeskHotelsDataTable> | null>} */
const travelDeskHotelsDataTable = ref(null)

async function refreshTravelDeskHotels() {
  return travelDeskHotelsDataTable.value?.refresh()
}

async function deleteHotel(hotel) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this hotel?")) return

  isLoading.value = true
  try {
    await travelDeskHotelsApi.delete(hotel.id)
    await refreshTravelDeskHotels()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  refresh: refreshFlightRequests,
})
</script>

<style scoped></style>
