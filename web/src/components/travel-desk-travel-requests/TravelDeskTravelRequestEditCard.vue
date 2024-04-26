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

    <div
      v-if="isNil(travelDeskTravelRequest)"
      class="mt-10"
      style="text-align: center"
    >
      loading ...
    </div>
    <v-card-text v-else>
      <v-row>
        <v-col cols="12">
          <TravelerDetailsFormCard
            ref="travelerDetailsFormCard"
            v-model="travelDeskTravelRequest"
            :show-save-state-progress="true"
            :is-saving="isLoading"
            @save-requested="saveAndNotify"
            @input="debouncedSaveAndNotify"
          />
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
                      <TravelDeskFlightRequestsEditTable
                        :travel-desk-travel-request-id="travelDeskTravelRequestId"
                        :travel-authorization-id="travelAuthorizationId"
                        class="borderless-card"
                        @updated="refreshTablesUsingFlightInfo"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    class="ml-3"
                    no-gutters
                  >
                    <v-col cols="12">
                      <SaveStateProgress
                        class="float-right my-0 mr-3 ml-3 hidden-sm-and-down"
                        :saving="isLoading"
                        @click="saveAndNotify"
                      />
                      <v-textarea
                        v-model="travelDeskTravelRequest.additionalInformation"
                        class="mt-5 mr-5"
                        label="Additional Information"
                        outlined
                        auto-grow
                        counter
                        @input="debouncedSaveAndNotify"
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
              <TravelDeskHotelEditTable
                ref="travelDeskHotelEditTable"
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
              />
              <TransportationRequestTable
                :authorized-travel="travelAuthorization"
                :readonly="false"
                :other-transportations="travelDeskTravelRequest.otherTransportation"
              />
            </template>
          </TitleCard>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn
        class="ml-auto mr-2"
        color="green darken-1"
        :loading="isLoading"
        @click="saveAndNotify"
      >
        Save Draft
      </v-btn>
      <v-btn
        class="mr-5 px-5"
        color="brown darken-1"
        :loading="savingData"
        @click="saveNewTravelRequest('submit')"
        >Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRefs } from "vue"
import { cloneDeep, debounce, isNil } from "lodash"

import { TRAVEL_DESK_URL } from "@/urls"
import { securePost } from "@/store/jwt"
import { useSnack } from "@/plugins/snack-plugin"

import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import SaveStateProgress from "@/components/SaveStateProgress.vue"
import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import TransportationRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/TransportationRequestTable.vue"

import TravelDeskFlightRequestsEditTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsEditTable.vue"
import TravelDeskHotelEditTable from "@/components/travel-desk-hotels/TravelDeskHotelEditTable.vue"
import TravelDeskRentalCarsEditTable from "@/components/travel-desk-rental-cars/TravelDeskRentalCarsEditTable.vue"
import TravelerDetailsFormCard from "@/components/travel-desk-travel-requests/TravelerDetailsFormCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const { travelDeskTravelRequestId } = toRefs(props)
const { travelDeskTravelRequest, isLoading, save } =
  useTravelDeskTravelRequest(travelDeskTravelRequestId)

const travelAuthorizationId = computed(() => travelDeskTravelRequest.value?.travelAuthorizationId)
const travelAuthorization = computed(() => travelDeskTravelRequest.value?.travelAuthorization)

const savingData = ref(false)

/** @type {import("vue").Ref<InstanceType<typeof TravelerDetailsFormCard> | null>} */
const travelerDetailsFormCard = ref(null)
/** @type {import("vue").Ref<InstanceType<typeof TravelDeskRentalCarsEditTable> | null>} */
const travelDeskRentalCarsEditTable = ref(null)
/** @type {import("vue").Ref<InstanceType<typeof TravelDeskHotelEditTable> | null>} */
const travelDeskHotelEditTable = ref(null)

const state = reactive({
  otherTransportationErr: false,
})

onMounted(async () => {
  initStates()
})

function initStates() {
  for (const key of Object.keys(state)) {
    state[key] = false
  }
}

function refreshTablesUsingFlightInfo() {
  travelDeskRentalCarsEditTable.value?.refresh()
  travelDeskHotelEditTable.value?.refresh()
}

const snack = useSnack()

async function saveAndNotify() {
  if (validate() !== true) {
    snack("Form validation failed! Please fill out all required fields.", {
      color: "error",
    })
    throw new Error("Form validation failed")
  }

  await save()
  snack("Request updated.")
}

const debouncedSaveAndNotify = debounce(saveAndNotify, 1000)

async function saveNewTravelRequest(saveType) {
  if (validate() !== true) {
    // TODO: notify user of validation error
    throw new Error("Form validation failed")
  }

  if (saveType == "save" || checkFields()) {
    savingData.value = true
    const body = cloneDeep(travelDeskTravelRequest.value)
    delete body.internationalTravel
    delete body.differentTravelContact
    delete body.office
    delete body.department
    delete body.fullName
    if (saveType == "submit" && body.status == "draft") {
      body.status = "submitted"
    } else if (saveType == "submit" && body.status == "options_provided") {
      body.status = "options_ranked"
    }
    const id = travelAuthorizationId.value
    try {
      await securePost(`${TRAVEL_DESK_URL}/travel-request/${id}`, body)
    } catch (error) {
      console.error(error)
    } finally {
      savingData.value = false
    }
  }
}

function checkFields() {
  state.otherTransportationErr = false

  if (travelDeskTravelRequest.value.status == "options_provided") {
    let error = false
    for (const question of travelDeskTravelRequest.value.questions) {
      if (question.response) question.state.responseErr = false
      else {
        question.state.responseErr = true
        error = true
      }
    }

    for (const flightRequest of travelDeskTravelRequest.value.flightRequests) {
      for (const flightOption of flightRequest.flightOptions) {
        if (!flightOption.flightPreference) {
          error = true
        }
      }
    }

    if (error) return false
  }

  for (const key of Object.keys(state)) {
    if (state[key]) return false
  }
  return true
}

function validate() {
  if (isNil(travelerDetailsFormCard.value)) {
    throw new Error("Travel details form could not be found")
  }

  return travelerDetailsFormCard.value.validate()
}
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css"></style>

<style scoped>
.v-card.borderless-card {
  border: none !important;
  box-shadow: none !important;
}
</style>
