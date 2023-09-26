<template>
  <v-card
    elevation="2"
    class="default"
  >
    <v-card-title> Details </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <!-- Depending on in territory flag we will load a different list of destinations -->
            <v-checkbox
              :value="request.allTravelWithinTerritory"
              label="In Territory?"
              dense
              required
              @change="updateAllTravelWithinTerritory"
            >
            </v-checkbox>
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-select
              :value="tripType"
              :items="tripTypes"
              :rules="[required]"
              label="Trip Type"
              background-color="white"
              dense
              outlined
              required
              @change="updateTripType"
            ></v-select>
          </v-col>
          <v-col></v-col>
          <v-col
            cols="12"
            md="2"
          >
            <!-- If accommodation type is other, support text field entry -->
            <v-select
              v-model="request.accommodationType"
              :items="accommodationTypes"
              :rules="[required]"
              label="Type of Accommodation"
              background-color="white"
              dense
              outlined
              required
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-if="request.accommodationType === ACCOMMODATION_TYPES.OTHER"
              v-model="accommodationTypeOther"
              :rules="[required]"
              label="Type of Accommodation - Other:"
              background-color="white"
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <RoundTripStopsSection v-if="tripType === TRIP_TYPES.ROUND_TRIP" />
        <OneWayStopsSection v-else-if="tripType === TRIP_TYPES.ONE_WAY" />
        <MuliDestinationStopsSection v-else-if="tripType === TRIP_TYPES.MULI_DESTINATION" />
        <div v-else>Trip type {{ tripType }} not implemented!</div>

        <v-row>
          <v-col cols="12" md="1">
            <v-text-field
              v-model="request.travelDuration"
              :rules="[required, isNumber]"
              label="# Days"
              background-color="white"
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="request.daysOffTravelStatus"
              :rules="[required, isNumber]"
              label="Days on non-travel status"
              background-color="white"
              dense
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <DatePicker
              v-model="request.dateBackToWork"
              :rules="[required]"
              text="Expected Date return to work"
              required
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { isEmpty } from "lodash"

import DatePicker from "@/components/Utils/DatePicker"
import RoundTripStopsSection from "./details-form-card/RoundTripStopsSection"
import OneWayStopsSection from "./details-form-card/OneWayStopsSection"
import MuliDestinationStopsSection from "./details-form-card/MuliDestinationStopsSection"

const TRIP_TYPES = Object.freeze({
  ROUND_TRIP: "Round Trip",
  ONE_WAY: "One Way",
  MULI_DESTINATION: "Muli-Destination",
})

const ACCOMMODATION_TYPES = Object.freeze({
  HOTEL: "Hotel",
  PRIVATE: "Private",
  OTHER: "Other:",
})

export default {
  name: "PurposeFormCard",
  components: {
    DatePicker,
    MuliDestinationStopsSection,
    OneWayStopsSection,
    RoundTripStopsSection,
  },
  data: () => ({
    loadingPurposes: false,
    loadingDestinations: false,
    ACCOMMODATION_TYPES,
    accommodationTypeOther: "",
    accommodationTypes: Object.values(ACCOMMODATION_TYPES),
    TRIP_TYPES,
    tripTypes: Object.values(TRIP_TYPES),
    tripType: TRIP_TYPES.ONE_WAY,
    required: (v) => !!v || "This field is required",
    isNumber: (v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number",
  }),
  computed: {
    ...mapState("travelForm", ["request", "destinations"]),
  },
  async mounted() {
    this.loadingDestinations = true
    await Promise.all([
      this.loadDestinations().finally(() => {
        this.loadingDestinations = false
      }),
    ])

    if (isEmpty(this.request.accommodationType)) {
      this.request.accommodationType = ACCOMMODATION_TYPES.HOTEL
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    updateAllTravelWithinTerritory(value) {
      // TODO: trigger load of different destination list
      this.allTravelWithinTerritory = value
    },
    updateTripType(value) {
      // TODO: update one of several boolean values on the form object
      this.tripType = value
    },
  },
}
</script>
