<template>
  <v-card
    :loading="isLoading"
    :disabled="isLoading"
  >
    <v-card-title
      class="primary"
      style="border-bottom: 1px solid black"
    >
      <div class="text-h5">Travel Desk Request</div>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <TravelerDetailsCard :travel-desk-travel-request-id="travelDeskTravelRequestId" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <TitleCard
            title-width="12.5rem"
            large-title
          >
            <template #title>
              <div>Travel Information</div>
            </template>
            <template #body>
              <TitleCard
                class="mt-5 mx-5"
                title-width="8.5rem"
              >
                <template #title>
                  <div>Flight Request</div>
                </template>
                <template #body>
                  <v-row
                    class="mt-0"
                    no-gutters
                  >
                    <v-col cols="12">
                      <TravelDeskFlightRequestsTable
                        :travel-desk-travel-request-id="travelDeskTravelRequestId"
                        class="borderless-card"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    class="ml-3"
                    no-gutters
                  >
                    <v-col cols="12">
                      <v-textarea
                        :value="travelDeskTravelRequest?.additionalInformation"
                        :loading="isLoading"
                        class="mt-5 mr-5"
                        label="Additional Information"
                        outlined
                        auto-grow
                        counter
                      />
                    </v-col>
                  </v-row>
                </template>
              </TitleCard>

              TODO: build TravelDeskRentalCarsTable
              <!-- <TravelDeskRentalCarsTable
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
              /> -->
              <br />TODO: build TravelDeskHotelTable
              <!-- <TravelDeskHotelTable
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
              /> -->
              <br />TODO: build TravelDeskOtherTransportationTable
              <!-- <TravelDeskOtherTransportationTable
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
              /> -->
            </template>
          </TitleCard>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { toRefs } from "vue"

import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

import TravelDeskFlightRequestsTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsTable.vue"
// import TravelDeskHotelTable from "@/components/travel-desk-hotels/TravelDeskHotelTable.vue"
// import TravelDeskOtherTransportationTable from "@/components/travel-desk-other-transportations/TravelDeskOtherTransportationTable.vue"
// import TravelDeskRentalCarsTable from "@/components/travel-desk-rental-cars/TravelDeskRentalCarsTable.vue"
import TravelerDetailsCard from "@/components/travel-desk-travel-requests/TravelerDetailsCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const { travelDeskTravelRequestId } = toRefs(props)
const { travelDeskTravelRequest, isLoading } = useTravelDeskTravelRequest(travelDeskTravelRequestId)

// const travelAuthorizationId = computed(() => travelDeskTravelRequest.value?.travelAuthorizationId)
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css"></style>

<style scoped>
.v-card.borderless-card {
  border: none !important;
  box-shadow: none !important;
}
</style>
