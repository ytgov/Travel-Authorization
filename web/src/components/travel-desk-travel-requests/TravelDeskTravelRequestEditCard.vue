<template>
  <v-skeleton-loader
    v-if="isNil(travelDeskTravelRequest)"
    type="card"
  />
  <v-card v-else>
    <v-card-title>
      <h4 class="text-h6">Travel Information</h4>
    </v-card-title>
    <v-card-text>
      <TitleCard class="mt-5">
        <template #title>
          <div>Flight Request</div>
        </template>
        <template #body>
          <v-row
            class="mt-0"
            no-gutters
          >
            <v-col cols="12">
              <TravelDeskFlightRequestsEditTable
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
                class="borderless-card"
                @updated="refreshTablesUsingFlightInfo"
              />
            </v-col>
          </v-row>
        </template>
      </TitleCard>

      <TravelDeskRentalCarsEditTable
        ref="travelDeskRentalCarsEditTable"
        :travel-desk-travel-request-id="travelDeskTravelRequestId"
        :travel-authorization-id="travelAuthorizationId"
      />
      <TravelDeskHotelsEditTable
        ref="travelDeskHotelEditTable"
        :travel-desk-travel-request-id="travelDeskTravelRequestId"
        :travel-authorization-id="travelAuthorizationId"
      />
      <TravelDeskOtherTransportationsEditTable
        :travel-desk-travel-request-id="travelDeskTravelRequestId"
        :travel-authorization-id="travelAuthorizationId"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"
import { isNil } from "lodash"

import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

import TravelDeskFlightRequestsEditTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsEditTable.vue"
import TravelDeskHotelsEditTable from "@/components/travel-desk-hotels/TravelDeskHotelsEditTable.vue"
import TravelDeskOtherTransportationsEditTable from "@/components/travel-desk-other-transportations/TravelDeskOtherTransportationsEditTable.vue"
import TravelDeskRentalCarsEditTable from "@/components/travel-desk-rental-cars/TravelDeskRentalCarsEditTable.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const { travelDeskTravelRequestId } = toRefs(props)
const { travelDeskTravelRequest } = useTravelDeskTravelRequest(travelDeskTravelRequestId)

const travelAuthorizationId = computed(() => travelDeskTravelRequest.value?.travelAuthorizationId)

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskRentalCarsEditTable> | null>} */
const travelDeskRentalCarsEditTable = ref(null)
/** @type {import("vue").Ref<InstanceType<typeof TravelDeskHotelsEditTable> | null>} */
const travelDeskHotelEditTable = ref(null)

function refreshTablesUsingFlightInfo() {
  travelDeskRentalCarsEditTable.value?.refresh()
  travelDeskHotelEditTable.value?.refresh()
}
</script>

<style scoped></style>

<style scoped>
.v-card.borderless-card {
  border: none !important;
  box-shadow: none !important;
}
</style>
