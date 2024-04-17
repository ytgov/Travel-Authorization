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
          <TravelerDetails
            :traveler-details="travelerDetails"
            :traveler-state="state"
            :readonly="false"
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

<script>
import { toRefs } from "vue"
import { isNil, isEmpty } from "lodash"

import { LOOKUP_URL, TRAVEL_DESK_URL } from "@/urls"
import { secureGet, securePost } from "@/store/jwt"

import useTravelAuthorization from "@/use/use-travel-authorization"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import TravelerDetails from "@/modules/travelDesk/views/Requests/Components/TravelerDetails.vue"
import FlightRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/FlightRequestTable.vue"
import RentalCarRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/RentalCarRequestTable.vue"
import HotelRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/HotelRequestTable.vue"
import TransportationRequestTable from "@/modules/travelDesk/views/Requests/RequestDialogs/TransportationRequestTable.vue"

export default {
  name: "TravelDeskTravelRequestCreateFormCard",
  components: {
    TitleCard,
    TravelerDetails,
    FlightRequestTable,
    RentalCarRequestTable,
    TransportationRequestTable,
    HotelRequestTable,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { travelAuthorizationId } = toRefs(props)

    const { travelAuthorization, fetch: fetchTravelAuthorization } =
      useTravelAuthorization(travelAuthorizationId)

    return {
      travelAuthorization,
      readonly: false,
      internationalTravel: false,

      travelerDetails: {
        travelAuthorizationId: props.travelAuthorizationId,
      },
      savingData: false,

      state: {
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
      },

      loadingData: false,
      fetchTravelAuthorization,
    }
  },
  async mounted() {
    await this.initForm()
  },
  methods: {
    async initForm() {
      this.initStates()
      this.savingData = false
      this.loadingData = true

      await this.fetchTravelAuthorization()
      const email = this.travelAuthorization.email || this.travelAuthorization.user?.email
      await this.getEmployeeInfo(email)
    },

    async getEmployeeInfo(email) {
      if (isNil(email) || isEmpty(email)) {
        this.loadingData = false
        throw new Error("Email is empty")
      }

      return secureGet(`${LOOKUP_URL}/employee-info?email=` + email)
        .then((resp) => {
          const employee = resp.data
          const travelerDetails = {
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
            travelAuthorizationId: this.travelAuthorizationId,
            additionalInformation: "",
            rentalCars: [],
            flightRequests: [],
            hotels: [],
            otherTransportation: [],
            questions: [],
            status: "draft",
          }
          this.travelerDetails = travelerDetails
          this.loadingData = false
        })
        .catch((error) => {
          console.error(`Failed to get employee info: ${error}`)
          this.loadingData = false
        })
    },

    saveNewTravelRequest(saveType) {
      if (saveType == "save" || this.checkFields()) {
        this.savingData = true
        const body = this.travelerDetails
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
        const id = this.travelAuthorizationId
        securePost(`${TRAVEL_DESK_URL}/travel-request/${id}`, body)
          .then(() => {
            this.savingData = false
          })
          .catch((e) => {
            this.savingData = false
            console.error(e)
          })
      }
    },

    initStates() {
      for (const key of Object.keys(this.state)) {
        this.state[key] = false
      }
    },

    checkFields() {
      this.state.firstNameErr = this.travelerDetails.legalFirstName ? false : true
      ;(this.state.middleNameErr = false),
        (this.state.lastNameErr = this.travelerDetails.legalLastName ? false : true)
      this.state.birthDateErr = this.travelerDetails.birthDate ? false : true
      this.state.travelAuthErr = false //this.travelerDetails.travelAuth? false:true; TODO: add this in backend
      this.state.addressErr = this.travelerDetails.strAddress ? false : true
      this.state.cityErr = this.travelerDetails.city ? false : true
      this.state.provinceErr = this.travelerDetails.province ? false : true
      this.state.postalCodeErr = this.travelerDetails.postalCode ? false : true
      this.state.passportNumberErr =
        this.internationalTravel && !this.travelerDetails.passportNum ? true : false
      this.state.passportCountryErr =
        this.internationalTravel && !this.travelerDetails.passportCountry ? true : false
      this.state.businessPhoneErr = this.travelerDetails.busPhone ? false : true
      this.state.businessEmailErr = this.travelerDetails.busEmail ? false : true
      this.state.travelPhoneErr =
        this.travelerDetails.travelContact && !this.travelerDetails.travelPhone ? true : false //show hint
      this.state.travelEmailErr =
        this.travelerDetails.travelContact && !this.travelerDetails.travelEmail ? true : false //show hint
      this.state.flightRequestsErr = false
      this.state.rentalCarsErr = false
      this.state.hotelsErr = false
      this.state.otherTransportationErr = false

      if (this.travelerDetails.status == "options_provided") {
        let error = false
        for (const question of this.travelerDetails.questions) {
          if (question.response) question.state.responseErr = false
          else {
            question.state.responseErr = true
            error = true
          }
        }

        for (const flightRequest of this.travelerDetails.flightRequests) {
          for (const flightOption of flightRequest.flightOptions) {
            if (!flightOption.flightPreference) {
              error = true
            }
          }
        }

        if (error) return false
      }

      for (const key of Object.keys(this.state)) {
        if (this.state[key]) return false
      }
      return true
    },
  },
}
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css"></style>
