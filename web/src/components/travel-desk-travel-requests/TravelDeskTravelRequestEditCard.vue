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
      v-if="isLoading"
      class="mt-10"
      style="text-align: center"
    >
      loading ...
    </div>
    <v-card-text v-else>
      <v-row class="mb-3">
        <v-col cols="12">
          <TravelerDetailsFormCard
            ref="travelerDetailsFormCard"
            v-model="travelDeskTravelRequest"
          />

          <TitleCard
            class="mt-10"
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
                  <v-row class="mt-0 mx-0">
                    <v-col cols="9">
                      <TravelDeskFlightRequestsEditTable
                        :travel-desk-travel-request-id="travelDeskTravelRequest.id"
                        :authorized-travel="travelAuthorization"
                        :readonly="false"
                        :travel-desk-user="false"
                        :show-flight-options="travelDeskTravelRequest.status != 'draft'"
                        :flight-requests="travelDeskTravelRequest.flightRequests"
                      />
                    </v-col>
                    <v-col
                      cols="3"
                      class="px-0"
                    >
                      <v-textarea
                        v-model="travelDeskTravelRequest.additionalInformation"
                        class="mt-5 mr-5"
                        :readonly="readonly"
                        label="Additional Information"
                        outlined
                        auto-grow
                        counter
                        :clearable="!readonly"
                      />
                    </v-col>
                  </v-row>
                </template>
              </TitleCard>

              <RentalCarRequestTable
                :authorized-travel="travelAuthorization"
                :readonly="false"
                :flight-requests="travelDeskTravelRequest.flightRequests"
                :rental-cars="travelDeskTravelRequest.rentalCars"
              />
              <HotelRequestTable
                :authorized-travel="travelAuthorization"
                :readonly="false"
                :flight-requests="travelDeskTravelRequest.flightRequests"
                :hotels="travelDeskTravelRequest.hotels"
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
        class="ml-auto mr-2 px-5"
        color="green darken-1"
        :loading="isLoading"
        @click="saveAndNotify"
        >Save Draft
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
import { cloneDeep, isNil } from "lodash"

import { TRAVEL_DESK_URL } from "@/urls"
import { securePost } from "@/store/jwt"
import { useSnack } from "@/plugins/snack-plugin"

import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import RentalCarRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/RentalCarRequestTable.vue"
import HotelRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/HotelRequestTable.vue"
import TransportationRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/TransportationRequestTable.vue"

import TravelDeskFlightRequestsEditTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsEditTable.vue"

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

const readonly = ref(false)
const internationalTravel = ref(false)

const savingData = ref(false)

const travelerDetailsFormCard = ref(null)
const state = reactive({
  firstNameErr: false,
  middleNameErr: false,
  lastNameErr: false,
  birthDateErr: false,
  travelAuthErr: false,
  addressErr: false,
  cityErr: false,
  provinceErr: false,
  postalCodeErr: false,
  passportNumberErr: false,
  passportCountryErr: false,
  businessPhoneErr: false,
  businessEmailErr: false,
  travelPhoneErr: false,
  travelEmailErr: false,
  flightRequestsErr: false,
  rentalCarsErr: false,
  hotelsErr: false,
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
  state.firstNameErr = travelDeskTravelRequest.value.legalFirstName ? false : true
  state.middleNameErr = false
  state.lastNameErr = travelDeskTravelRequest.value.legalLastName ? false : true
  state.birthDateErr = travelDeskTravelRequest.value.birthDate ? false : true
  state.travelAuthErr = false //this.travelDeskTravelRequest.travelAuth? false:true; TODO: add this in backend
  state.addressErr = travelDeskTravelRequest.value.strAddress ? false : true
  state.cityErr = travelDeskTravelRequest.value.city ? false : true
  state.provinceErr = travelDeskTravelRequest.value.province ? false : true
  state.postalCodeErr = travelDeskTravelRequest.value.postalCode ? false : true
  state.passportNumberErr =
    internationalTravel.value && !travelDeskTravelRequest.value.passportNum ? true : false
  state.passportCountryErr =
    internationalTravel.value && !travelDeskTravelRequest.value.passportCountry ? true : false
  state.businessPhoneErr = travelDeskTravelRequest.value.busPhone ? false : true
  state.businessEmailErr = travelDeskTravelRequest.value.busEmail ? false : true
  state.travelPhoneErr =
    travelDeskTravelRequest.value.travelContact && !travelDeskTravelRequest.value.travelPhone
      ? true
      : false //show hint
  state.travelEmailErr =
    travelDeskTravelRequest.value.travelContact && !travelDeskTravelRequest.value.travelEmail
      ? true
      : false //show hint
  state.flightRequestsErr = false
  state.rentalCarsErr = false
  state.hotelsErr = false
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
