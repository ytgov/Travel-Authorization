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
            <TravelerDetailsFormCard v-model="travelDeskTravelRequest" />
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
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <UserTravelDeskAgentSelect
              v-model="travelDeskTravelRequest.travelDeskOfficer"
              label="Travel Desk Agent Assigned"
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
            <TravelDeskQuestionsManageCard
              :travel-desk-travel-request-id="travelDeskTravelRequest.id"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card
              class="mt-10"
              large-title
            >
              <v-card-title>
                <h3>Travel Information</h3>
              </v-card-title>
              <v-card-text>
                <TravelDeskFlightRequestsManageCard
                  :travel-desk-travel-request-id="travelDeskTravelRequest.id"
                  :travel-authorization-id="travelDeskTravelRequest.travelAuthorizationId"
                  show-flight-options
                />
                <RentalCarRequestTable
                  :flight-requests="travelDeskTravelRequest.flightRequests"
                  :rental-cars="travelDeskTravelRequest.rentalCars"
                />
                <HotelRequestTable
                  :flight-requests="travelDeskTravelRequest.flightRequests"
                  :hotels="travelDeskTravelRequest.hotels"
                />
                <TransportationRequestTable
                  :other-transportations="travelDeskTravelRequest.otherTransportations"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-skeleton-loader
        v-if="isNil(travelDeskTravelRequest)"
        type="actions"
      />
      <v-card-actions v-else>
        <v-btn
          color="grey darken-5"
          class="px-5"
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
        <UploadPnrModal
          :travel-request="travelDeskTravelRequest"
          :class="travelDeskTravelRequest.invoiceNumber ? 'ml-1 mr-2' : 'ml-auto mr-2'"
          @saveData="saveNewTravelRequest('save')"
          @close="refresh"
        />
        <v-btn
          class="ml-2 mr-2 px-5"
          color="#005A65"
          :loading="isLoading"
          @click="saveTravelDeskTravelRequest"
          >Save Draft
        </v-btn>
        <v-btn
          class="mr-2 px-5"
          color="secondary"
          :loading="savingData"
          @click="saveNewTravelRequest('sendback', { returnToTravelDeskPageAfter: true })"
          >Send to Traveler
        </v-btn>

        <v-btn
          v-if="travelDeskTravelRequest.invoiceNumber"
          class="mr-5 px-5"
          color="#005A65"
          :loading="savingData"
          @click="openConfirmBookingDialog"
          >Booking Complete
        </v-btn>
      </v-card-actions>

      <TravelDeskTravelRequestConfirmBookingDialog
        ref="confirmBookingDialog"
        @booked="refresh"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue"
import { useRouter } from "vue2-helpers/vue-router"
import { cloneDeep, isNil } from "lodash"

import { TRAVEL_DESK_URL } from "@/urls"
import { useSnack } from "@/plugins/snack-plugin"
import http from "@/api/http-client"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"
import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import TravelerDetailsFormCard from "@/components/travel-desk-travel-requests/TravelerDetailsFormCard.vue"
import RentalCarRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/RentalCarRequestTable.vue"
import HotelRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/HotelRequestTable.vue"
import TransportationRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/TransportationRequestTable.vue"

import UploadPnrModal from "@/modules/travelDesk/views/Desk/PnrDocument/UploadPnrModal.vue"
import ItineraryModal from "@/modules/travelDesk/views/Requests/Components/ItineraryModal.vue"

import UserTravelDeskAgentSelect from "@/components/users/UserTravelDeskAgentSelect.vue"
import TravelDeskTravelAgencySelect from "@/components/travel-desk-travel-agencies/TravelDeskTravelAgencySelect.vue"
import TravelDeskTravelRequestConfirmBookingDialog from "@/components/travel-desk-travel-requests/TravelDeskTravelRequestConfirmBookingDialog.vue"
import TravelDeskQuestionsManageCard from "@/components/travel-desk-questions/TravelDeskQuestionsManageCard.vue"
import TravelDeskInvoiceCard from "@/components/travel-desk-travel-requests/TravelDeskInvoiceCard.vue"
import TravelDeskFlightRequestsManageCard from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsManageCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: [Number, String],
    required: true,
  },
})

const snack = useSnack()
const { currentUser } = useCurrentUser()

const { travelDeskTravelRequestId } = toRefs(props)
const {
  travelDeskTravelRequest,
  isLoading,
  refresh: refreshTravelDeskTravelRequest,
  save: saveTravelDeskTravelRequest,
} = useTravelDeskTravelRequest(travelDeskTravelRequestId)

const savingData = ref(false)

async function refresh() {
  await refreshTravelDeskTravelRequest()
  await nextTick()
  if (isNil(travelDeskTravelRequest.value.travelDeskOfficer)) {
    travelDeskTravelRequest.value.travelDeskOfficer = currentUser.value.displayName
  }

  travelDeskTravelRequest.value.internationalTravel =
    travelDeskTravelRequest.value.passportCountry || travelDeskTravelRequest.value.passportNum
}

const router = useRouter()

async function saveNewTravelRequest(saveType, { returnToTravelDeskPageAfter = false } = {}) {
  const body = cloneDeep(travelDeskTravelRequest.value)
  delete body.internationalTravel
  delete body.differentTravelContact
  delete body.office
  delete body.department
  delete body.fullName

  // TODO: move status updates to state specific endpoints
  if (saveType == "save") {
    // no-op
  } else if (saveType == "sendback") {
    body.status = TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.OPTIONS_PROVIDED
  } else if (saveType == "booked") {
    body.status = TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.BOOKED
  }

  savingData.value = true
  try {
    await http.post(`${TRAVEL_DESK_URL}/travel-request/${props.travelDeskTravelRequestId}`, body)

    snack.success("Travel request saved.", {
      color: "success",
    })
    savingData.value = false

    if (returnToTravelDeskPageAfter) {
      return router.push({
        name: "TravelDeskPage",
      })
    } else {
      refresh()
    }
  } catch (error) {
    console.error(error)
    snack.error(`Failed to save travel request: ${error}`)
  } finally {
    savingData.value = false
  }
}

const confirmBookingDialog = ref(null)

function openConfirmBookingDialog() {
  confirmBookingDialog.value.open(props.travelDeskTravelRequestId)
}

useBreadcrumbs([
  {
    text: "Travel Desk",
    to: {
      name: "TravelDeskPage",
    },
  },
  {
    text: "Request",
    to: {
      name: "TravelDeskReadPage",
      params: { travelDeskTravelRequestId: props.travelDeskTravelRequestId },
    },
  },
  {
    text: "Edit",
    to: {
      name: "TravelDeskEditPage",
      params: { travelDeskTravelRequestId: props.travelDeskTravelRequestId },
    },
  },
])
</script>

<style scoped></style>
