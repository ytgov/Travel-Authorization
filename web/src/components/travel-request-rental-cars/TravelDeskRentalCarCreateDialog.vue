<template>
  <div>
    <v-dialog
      v-model="rentalCarDialog"
      persistent
      max-width="80%"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="my-4 right"
          color="primary"
          v-bind="attrs"
          @click="initForm"
          v-on="on"
        >
          Add Rental Car
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="blue">
          <div class="text-h5">Add Rental Car</div>
        </v-card-title>

        <v-card-text>
          <!-- <ROW-1> -->
          <v-row class="mt-5 mx-0">
            <v-col cols="4">
              <v-autocomplete
                v-model="carRequest.pickUpCity"
                :items="destinations"
                item-value="text"
                :error="state.pickUpCityErr"
                label="Pick-up City"
                outlined
                @input="state.pickUpCityErr = false"
              />
            </v-col>
            <v-col cols="5">
              <label>Pick-up/Drop-off match flights</label>
              <v-radio-group
                v-model="carRequest.matchFlightTimes"
                :disabled="!flightStart || !flightEnd"
                :error="state.matchFlightTimesErr"
                class="mt-1"
                row
                @change="matchWithFlight"
              >
                <v-radio
                  label="Yes"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="carRequest.vehicleType"
                :items="vehicleList"
                :error="state.vehicleTypesErr"
                label="Vehicle Type"
                outlined
                @input="state.vehicleTypesErr = false"
              />
            </v-col>
          </v-row>
          <!-- <ROW-2> -->
          <v-row class="mt-0 mx-0">
            <v-col cols="3">
              <v-select
                v-model="carRequest.pickUpLocation"
                :items="pickUpLocations"
                :error="state.pickUpLocationErr"
                label="Pick-up Location"
                outlined
                @input="state.pickUpLocationErr = false"
              />
              <v-text-field
                v-if="carRequest.pickUpLocation == 'Other'"
                v-model="carRequest.pickUpLocationOther"
                class="mt-n3"
                :error="state.pickUpLocationOtherErr"
                label="Other Pick-up Location"
                outlined
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="pickUpDate"
                :disabled="carRequest.matchFlightTimes"
                :readonly="readonly"
                :error="state.pickUpDateErr"
                label="Pick-up date"
                outlined
                :min="minDate"
                :max="maxDate"
                type="date"
                @input="state.pickUpDateErr = false"
              />
              <v-text-field
                v-model="dropOffDate"
                class="mt-n3"
                :disabled="carRequest.matchFlightTimes"
                :readonly="readonly"
                :error="state.dropOffDateErr"
                label="Drop-off date"
                outlined
                :min="minDate"
                :max="maxDate"
                type="date"
                @input="state.dropOffDateErr = false"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="pickUpTime"
                :readonly="readonly"
                :error="state.pickUpTimeErr"
                label="Pick-up time"
                outlined
                type="time"
                @input="state.pickUpTimeErr = false"
              />
              <v-text-field
                v-model="dropOffTime"
                class="mt-n3"
                :readonly="readonly"
                :error="state.dropOffTimeErr"
                label="Drop-off time"
                outlined
                type="time"
                @input="state.dropOffTimeErr = false"
              />
            </v-col>
            <v-col cols="5">
              <v-textarea
                v-model="carRequest.vehicleChangeRationale"
                :readonly="readonly"
                :error="state.reasonForChangeErr"
                label="Reason for Change"
                rows="4"
                outlined
                :clearable="!readonly"
              />
            </v-col>
          </v-row>
          <!-- <ROW-3> -->
          <v-row class="mt-0 mx-0">
            <v-col cols="3">
              <div class="label">Same Drop-off location?</div>
              <v-radio-group
                v-model="carRequest.sameDropOffLocation"
                :error="state.sameDropOffLocationErr"
                class="mt-1"
                row
              >
                <v-radio
                  label="Yes"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="false"
                ></v-radio>
              </v-radio-group>
              <v-autocomplete
                v-if="!carRequest.sameDropOffLocation"
                v-model="carRequest.dropOffCity"
                :items="destinations"
                item-value="text"
                :error="state.dropOffCityErr"
                class="mt-n1"
                label="Drop-off City"
                outlined
                @input="state.dropOffCityErr = false"
              />
            </v-col>
            <v-col cols="3">
              <v-select
                v-if="!carRequest.sameDropOffLocation"
                v-model="carRequest.dropOffLocation"
                :items="pickUpLocations"
                class="mt-n1"
                :error="state.dropOffLocationErr"
                label="Drop-off Location:"
                outlined
              />
              <v-text-field
                v-if="!carRequest.sameDropOffLocation && carRequest.dropOffLocation == 'Other'"
                v-model="carRequest.dropOffLocationOther"
                class="mt-n3"
                :error="state.dropOffLocationOtherErr"
                label="Other Drop-off Location"
                outlined
                @input="state.dropOffLocationOtherErr = false"
              />
            </v-col>
            <v-col cols="6">
              <v-textarea
                v-model="carRequest.additionalNotes"
                :readonly="readonly"
                :error="state.additionalNotesErr"
                label="Additional Information"
                outlined
                rows="4"
                :clearable="!readonly"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="grey darken-5"
            @click="rentalCarDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="ml-auto"
            color="green darken-1"
            @click="saveRentalCarRequest"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue"

export default {
  name: "TravelDeskRentalCarCreateDialog",
  props: {
    type: {
      type: String,
      required: true,
    },
    carRequest: {
      type: Object,
      required: true,
    },
    flightRequests: {
      type: Array,
      required: true,
    },
    minDate: {
      type: String,
      default: "",
    },
    maxDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pickUpDate: "",
      pickUpTime: "",
      dropOffDate: "",
      dropOffTime: "",

      flightStart: "",
      flightEnd: "",

      rentalCarDialog: false,
      vehicleList: [
        "Economy",
        "Compact",
        "Intermediate",
        "Standard",
        "Full-Size",
        "Intermediate SUV",
        "Luxury",
        "Minivan",
        "Standard SUV",
        "Full-Size SUV",
        "Pickup Truck",
      ],
      pickUpLocations: ["Airport", "Hotel", "Downtown", "Other"],

      readonly: false,

      state: {
        pickUpCityErr: false,
        dropOffCityErr: false,
        pickUpLocationErr: false,
        pickUpLocationOtherErr: false,
        dropOffLocationErr: false,
        dropOffLocationOtherErr: false,
        sameDropOffLocationErr: false,
        matchFlightTimesErr: false,
        pickUpDateErr: false,
        pickUpTimeErr: false,
        dropOffDateErr: false,
        dropOffTimeErr: false,
        vehicleTypesErr: false,
        reasonForChangeErr: false,
        additionalNotesErr: false,
      },
      destinations: [],
    }
  },
  mounted() {
    this.destinations = this.$store.state.traveldesk.destinations
  },
  methods: {
    checkFields() {
      this.state.pickUpCityErr = this.carRequest.pickUpCity ? false : true
      this.state.pickUpLocationErr = this.carRequest.pickUpLocation ? false : true
      this.state.pickUpLocationOtherErr =
        this.carRequest.pickUpLocation == "Other" && !this.carRequest.pickUpLocationOther
          ? true
          : false

      this.state.sameDropOffLocationErr = this.carRequest.sameDropOffLocation != null ? false : true
      this.state.dropOffLocationErr =
        !this.carRequest.sameDropOffLocation && !this.carRequest.dropOffLocation ? true : false
      this.state.dropOffCityErr =
        !this.carRequest.sameDropOffLocation && !this.carRequest.dropOffCity ? true : false

      this.state.matchFlightTimesErr = this.carRequest.matchFlightTimes != null ? false : true
      this.state.vehicleTypesErr = this.carRequest.vehicleType ? false : true
      this.state.reasonForChangeErr =
        this.carRequest.vehicleType != "Compact" && !this.carRequest.vehicleChangeRationale
          ? true
          : false
      this.state.additionalNotesErr = false

      this.state.pickUpDateErr = this.pickUpDate ? false : true
      this.state.pickUpTimeErr = this.pickUpTime ? false : true

      this.state.dropOffDateErr = this.dropOffDate ? false : true
      this.state.dropOffTimeErr = this.dropOffTime ? false : true

      for (const key of Object.keys(this.state)) {
        if (this.state[key]) return false
      }
      return true
    },

    saveRentalCarRequest() {
      if (this.checkFields()) {
        this.carRequest.pickUpDate = this.pickUpDate + "T" + this.pickUpTime + ":00.000Z"
        this.carRequest.dropOffDate = this.dropOffDate + "T" + this.dropOffTime + ":00.000Z"
        this.$emit("updateTable", this.type)
        this.rentalCarDialog = false
      }
    },

    initForm() {
      this.initStates()
      const flightDates = Vue.filter("flightStartEnd")(this.flightRequests)
      this.flightStart = flightDates.start
      this.flightEnd = flightDates.end

      if (this.type == "Add New") {
        this.carRequest.pickUpCity = ""
        this.carRequest.dropOffCity = ""
        this.carRequest.pickUpLocation = ""
        this.carRequest.pickUpLocationOther = ""
        this.carRequest.dropOffLocation = ""
        this.carRequest.dropOffLocationOther = ""
        this.carRequest.sameDropOffLocation = true
        this.carRequest.vehicleType = "Compact"
        this.carRequest.pickUpDate = ""
        this.carRequest.dropOffDate = ""
        this.carRequest.additionalNotes = ""
        this.carRequest.status = "Requested" //, Reserved"
        this.carRequest.vehicleChangeRationale = ""
        this.carRequest.matchFlightTimes = false

        this.pickUpDate = ""
        this.pickUpTime = "12:00"
        this.dropOffDate = ""
        this.dropOffTime = "12:00"
      } else {
        this.pickUpDate = this.carRequest.pickUpDate.slice(0, 10)
        this.pickUpTime = this.carRequest.pickUpDate.slice(11, 16)
        this.dropOffDate = this.carRequest.dropOffDate.slice(0, 10)
        this.dropOffTime = this.carRequest.dropOffDate.slice(11, 16)
        if (!this.flightStart || !this.flightEnd) this.carRequest.matchFlightTimes = false
      }
    },

    initStates() {
      for (const key of Object.keys(this.state)) {
        this.state[key] = false
      }
    },

    matchWithFlight() {
      if (this.carRequest.matchFlightTimes) {
        this.pickUpDate = this.flightStart
        this.dropOffDate = this.flightEnd
      }
    },
  },
}
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
