<template>
  <v-card
    :loading="isLoading"
    class="pt-1"
  >
    <div class="d-flex justify-end pr-4">
      <TravelDeskFlightRequestCreateDialog
        :travel-desk-travel-request-id="travelDeskTravelRequestId"
        :min-date="minDate"
        :max-date="maxDate"
        @created="refreshAndEmitUpdated"
      />
    </div>
    <v-row class="mb-3 mx-0">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="travelDeskFlightRequests"
          :loading="isLoading"
          hide-default-footer
          class="elevation-1"
        >
          <template #top>
            <TravelDeskFlightRequestEditDialog
              ref="editDialog"
              :min-date="minDate"
              :max-date="maxDate"
              @saved="refreshAndEmitUpdated"
            />
          </template>
          <template #item.datePreference="{ value }">
            {{ formatDate(value) }}
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-end">
              <v-btn
                title="Edit"
                icon
                color="blue"
                @click="showEditDialog(item.id)"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                :loading="isLoading"
                title="Delete"
                icon
                color="red"
                @click="deleteFlightRequest(item)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { first, last } from "lodash"
import { ref, computed, toRefs } from "vue"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import formatDate from "@/utils/format-date"
import travelDeskFlightRequestsApi from "@/api/travel-desk-flight-requests-api"
import useTravelDeskFlightRequests from "@/use/use-travel-desk-flight-requests"

import TravelDeskFlightRequestCreateDialog from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestCreateDialog.vue"
import TravelDeskFlightRequestEditDialog from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestEditDialog.vue"
import useTravelAuthorization from "@/use/use-travel-authorization"

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

const emit = defineEmits(["updated"])

const headers = [
  {
    text: "Depart Location",
    value: "departLocation",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Arrive Location",
    value: "arriveLocation",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "Date", value: "datePreference", class: "blue-grey lighten-4" },
  {
    text: "Time Preference",
    value: "timePreference",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "Seat Preference",
    value: "seatPreference",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "", value: "actions", class: "blue-grey lighten-4", width: "4rem", sortable: false },
]

const travelDeskFlightRequestsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskFlightRequests, isLoading, refresh } = useTravelDeskFlightRequests(
  travelDeskFlightRequestsQuery
)
const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const firstTravelSegment = computed(() => first(travelAuthorization.value?.travelSegments))
const lastTravelSegment = computed(() => last(travelAuthorization.value?.travelSegments))

const minDate = computed(() => firstTravelSegment.value?.departureOn)
const maxDate = computed(() => lastTravelSegment.value?.departureOn)

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskFlightRequestEditDialog> | null>} */
const editDialog = ref(null)

function showEditDialog(flightRequestId) {
  editDialog.value?.show(flightRequestId)
}

async function deleteFlightRequest(flightRequest) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this flight request?")) return

  try {
    await travelDeskFlightRequestsApi.delete(flightRequest.id)
    await refresh()
  } catch (error) {
    console.error(error)
  }
}

function refreshAndEmitUpdated() {
  refresh()
  emit("updated")
}
</script>

<style scoped>
::v-deep .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  background: #f9f9f9 !important;
}
</style>
