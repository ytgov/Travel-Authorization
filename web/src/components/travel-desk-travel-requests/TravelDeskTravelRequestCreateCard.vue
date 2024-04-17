<template>
  <v-card
    :loading="loadingData"
    :disabled="loadingData"
  >
    <v-card-title
      class="primary"
      style="border-bottom: 1px solid black"
    >
      <div class="text-h5">Travel Desk Request</div>
    </v-card-title>

    <div
      v-if="loadingData"
      class="mt-10"
      style="text-align: center"
    >
      loading ...
    </div>
    <v-card-text v-if="!loadingData">
      <v-row class="mb-3">
        <v-col cols="12">
          <TravelerDetailsFormCard
            ref="travelerDetailsFormCard"
            v-model="travelerDetails"
          />

          <title-card
            class="mt-10"
            title-width="12.5rem"
            large-title
          >
            <template #title>
              <div>Travel Information</div>
            </template>
            <template #body>
              <title-card
                class="mt-5 mx-5"
                title-width="8.5rem"
              >
                <template #title>
                  <div>Flight Request</div>
                </template>
                <template #body>
                  <v-row class="mt-0 mx-0">
                    <v-col cols="9">
                      <FlightRequestTable
                        :travel-desk-travel-request-id="travelerDetails.id"
                        :authorized-travel="travelAuthorization"
                        :readonly="false"
                        :travel-desk-user="false"
                        :show-flight-options="travelerDetails.status != 'draft'"
                        :flight-requests="travelerDetails.flightRequests"
                      />
                    </v-col>
                    <v-col
                      cols="3"
                      class="px-0"
                    >
                      <v-textarea
                        v-model="travelerDetails.additionalInformation"
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
              </title-card>

              <RentalCarRequestTable
                :authorized-travel="travelAuthorization"
                :readonly="false"
                :flight-requests="travelerDetails.flightRequests"
                :rental-cars="travelerDetails.rentalCars"
              />
              <HotelRequestTable
                :authorized-travel="travelAuthorization"
                :readonly="false"
                :flight-requests="travelerDetails.flightRequests"
                :hotels="travelerDetails.hotels"
              />
              <TransportationRequestTable
                :authorized-travel="travelAuthorization"
                :readonly="false"
                :other-transportations="travelerDetails.otherTransportation"
              />
            </template>
          </title-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn
        class="ml-auto mr-2 px-5"
        color="green darken-1"
        :loading="savingData"
        @click="saveNewTravelRequest('save')"
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
import { onMounted, reactive, ref, toRefs } from "vue"
import { cloneDeep, isNil, isEmpty } from "lodash"

import { LOOKUP_URL, TRAVEL_DESK_URL } from "@/urls"
import { secureGet, securePost } from "@/store/jwt"

import useTravelAuthorization from "@/use/use-travel-authorization"

import TravelerDetailsFormCard from "@/components/travel-desk-travel-requests/TravelerDetailsFormCard.vue"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import FlightRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/FlightRequestTable.vue"
import RentalCarRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/RentalCarRequestTable.vue"
import HotelRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/HotelRequestTable.vue"
import TransportationRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/TransportationRequestTable.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)

const { travelAuthorization, fetch: fetchTravelAuthorization } =
  useTravelAuthorization(travelAuthorizationId)

const readonly = ref(false)
const internationalTravel = ref(false)

const travelerDetails = ref({
  travelAuthorizationId: props.travelAuthorizationId,
})
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

const loadingData = ref(false)

onMounted(async () => {
  await initForm()
})

async function initForm() {
  initStates()
  savingData.value = false
  loadingData.value = true

  await fetchTravelAuthorization()
  const email = travelAuthorization.value.email || travelAuthorization.value.user?.email
  await getEmployeeInfo(email)
}

function initStates() {
  for (const key of Object.keys(state)) {
    state[key] = false
  }
}

async function getEmployeeInfo(email) {
  if (isNil(email) || isEmpty(email)) {
    loadingData.value = false
    throw new Error("Email is empty")
  }

  try {
    const { data: employee } = await secureGet(`${LOOKUP_URL}/employee-info?email=` + email)
    travelerDetails.value = {
      travelAuthorizationId: props.travelAuthorizationId,
      legalFirstName: employee.firstName,
      legalMiddleName: "",
      legalLastName: employee.lastName,
      birthDate: "",
      strAddress: employee.address,
      city: employee.community,
      province: employee.community?.toLowerCase() == "whitehorse" ? "Yukon" : "",
      postalCode: employee.postalCode,
      passportCountry: "",
      passportNum: "",
      travelPurpose: "",
      travelLocation: "",
      travelNotes: "",
      busPhone: employee.businessPhone,
      busEmail: employee.email,
      travelContact: false,
      travelPhone: employee.mobile,
      travelEmail: "",
      travelDeskOfficer: "",
      internationalTravel: false,
      office: employee.office,
      department: employee.department,
      fullName: employee.fullName,
      additionalInformation: "",
      rentalCars: [],
      flightRequests: [],
      hotels: [],
      otherTransportation: [],
      questions: [],
      status: "draft",
    }
  } catch (error) {
    console.error(`Failed to get employee info: ${error}`)
  } finally {
    loadingData.value = false
  }
}

async function saveNewTravelRequest(saveType) {
  if (validate() !== true) {
    // TODO: notify user of validation error
    throw new Error("Form validation failed")
  }

  if (saveType == "save" || checkFields()) {
    savingData.value = true
    const body = cloneDeep(travelerDetails.value)
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
  state.firstNameErr = travelerDetails.value.legalFirstName ? false : true
  state.middleNameErr = false
  state.lastNameErr = travelerDetails.value.legalLastName ? false : true
  state.birthDateErr = travelerDetails.value.birthDate ? false : true
  state.travelAuthErr = false //this.travelerDetails.travelAuth? false:true; TODO: add this in backend
  state.addressErr = travelerDetails.value.strAddress ? false : true
  state.cityErr = travelerDetails.value.city ? false : true
  state.provinceErr = travelerDetails.value.province ? false : true
  state.postalCodeErr = travelerDetails.value.postalCode ? false : true
  state.passportNumberErr =
    internationalTravel.value && !travelerDetails.value.passportNum ? true : false
  state.passportCountryErr =
    internationalTravel.value && !travelerDetails.value.passportCountry ? true : false
  state.businessPhoneErr = travelerDetails.value.busPhone ? false : true
  state.businessEmailErr = travelerDetails.value.busEmail ? false : true
  state.travelPhoneErr =
    travelerDetails.value.travelContact && !travelerDetails.value.travelPhone ? true : false //show hint
  state.travelEmailErr =
    travelerDetails.value.travelContact && !travelerDetails.value.travelEmail ? true : false //show hint
  state.flightRequestsErr = false
  state.rentalCarsErr = false
  state.hotelsErr = false
  state.otherTransportationErr = false

  if (travelerDetails.value.status == "options_provided") {
    let error = false
    for (const question of travelerDetails.value.questions) {
      if (question.response) question.state.responseErr = false
      else {
        question.state.responseErr = true
        error = true
      }
    }

    for (const flightRequest of travelerDetails.value.flightRequests) {
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
