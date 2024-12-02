<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2>Travel Desk Request</h2>
      </v-card-title>

      <v-skeleton-loader
        v-if="isNil(travelDeskTravelRequest)"
        type="card"
      />
      <v-card-text v-else>
        <v-row>
          <v-col>
            <TravelerDetailsCard :travel-desk-travel-request-id="travelDeskTravelRequest.id" />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <TravelDeskTravelAgencySelect
              v-model="travelDeskTravelRequest.travelAgencyId"
              label="Assign Agency"
              placeholder="None"
              clearable
              outlined
              persistent-placeholder
              readonly
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <UserTravelDeskAgentSelect
              v-model="travelDeskTravelRequest.travelDeskOfficer"
              label="Travel Desk Agent Assigned"
              readonly
              outlined
            />
          </v-col>
        </v-row>
        <v-row v-if="travelDeskTravelRequest.invoiceNumber">
          <v-col>
            <TravelDeskInvoiceCard :travel-desk-travel-request-id="travelDeskTravelRequest.id" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <TravelDeskQuestionsCard :travel-desk-travel-request-id="travelDeskTravelRequest.id" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <TitleCard
              class="mt-10"
              large-title
            >
              <template #title>
                <div>Travel Information</div>
              </template>
              <template #body>
                <TravelDeskFlightRequestsTable
                  :travel-desk-travel-request-id="travelDeskTravelRequest.id"
                  :travel-authorization-id="travelDeskTravelRequest.travelAuthorizationId"
                  show-flight-options
                  class="mx-5"
                />
                <RentalCarRequestTable
                  readonly
                  :flight-requests="travelDeskTravelRequest.flightRequests"
                  :rental-cars="travelDeskTravelRequest.rentalCars"
                />
                <HotelRequestTable
                  readonly
                  :flight-requests="travelDeskTravelRequest.flightRequests"
                  :hotels="travelDeskTravelRequest.hotels"
                />
                <TransportationRequestTable
                  readonly
                  :other-transportations="travelDeskTravelRequest.otherTransportations"
                />
              </template>
            </TitleCard>
          </v-col>
        </v-row>
      </v-card-text>

      <v-skeleton-loader
        v-if="isNil(travelDeskTravelRequest)"
        type="actions"
      />
      <v-card-actions v-else>
        <v-spacer />
        <v-btn
          color="primary"
          class="mr-2"
          :to="{
            name: 'TravelDeskPage',
          }"
        >
          <div>Back</div>
        </v-btn>
        <ItineraryModal
          v-if="travelDeskTravelRequest.invoiceNumber"
          class="ml-auto mr-3"
          :invoice-number="travelDeskTravelRequest.invoiceNumber"
        />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { toRefs } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import TravelerDetailsCard from "@/components/travel-desk-travel-requests/TravelerDetailsCard.vue"
import RentalCarRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/RentalCarRequestTable.vue"
import HotelRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/HotelRequestTable.vue"
import TransportationRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/TransportationRequestTable.vue"

import ItineraryModal from "@/modules/travelDesk/views/Requests/Components/ItineraryModal.vue"

import UserTravelDeskAgentSelect from "@/components/users/UserTravelDeskAgentSelect.vue"
import TravelDeskTravelAgencySelect from "@/components/travel-desk-travel-agencies/TravelDeskTravelAgencySelect.vue"
import TravelDeskQuestionsCard from "@/components/travel-desk-questions/TravelDeskQuestionsCard.vue"
import TravelDeskInvoiceCard from "@/components/travel-desk-travel-requests/TravelDeskInvoiceCard.vue"
import TravelDeskFlightRequestsTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsTable.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: [Number, String],
    required: true,
  },
})

const { travelDeskTravelRequestId } = toRefs(props)
const { travelDeskTravelRequest } = useTravelDeskTravelRequest(travelDeskTravelRequestId)

useBreadcrumbs([
  {
    text: "Travel Desk",
    to: {
      name: "TravelDeskPage",
    },
  },
  // TODO: Replace with read-only route once that exists.
  {
    text: "Request",
    to: {
      name: "TravelDeskReadPage",
      params: { travelDeskTravelRequestId: props.travelDeskTravelRequestId },
    },
  },
])
</script>

<style scoped></style>
