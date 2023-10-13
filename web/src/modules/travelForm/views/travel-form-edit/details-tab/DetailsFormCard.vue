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
              v-model="currentForm.allTravelWithinTerritory"
              label="In Territory?"
              dense
              required
            >
            </v-checkbox>
          </v-col>
          <v-col
            cols="12"
            md="3"
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
        </v-row>

        <RoundTripStopsSection v-if="tripType === TRIP_TYPES.ROUND_TRIP" />
        <OneWayStopsSection v-else-if="tripType === TRIP_TYPES.ONE_WAY" />
        <MuliDestinationStopsSection v-else-if="tripType === TRIP_TYPES.MULI_DESTINATION" />
        <div v-else>Trip type {{ tripType }} not implemented!</div>

        <v-row>
          <v-col
            cols="12"
            md="1"
          >
            <v-text-field
              v-model="currentForm.travelDuration"
              :rules="[required, isNumber]"
              label="# Days"
              background-color="white"
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-text-field
              v-model="currentForm.daysOffTravelStatus"
              :rules="[isNumber]"
              label="Days on non-travel status"
              background-color="white"
              dense
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <DatePicker
              v-model="currentForm.dateBackToWork"
              :min="finalDestination.departureDate"
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
import { mapState, mapGetters } from "vuex"
import { last } from "lodash"

import DatePicker from "@/components/Utils/DatePicker"
import MuliDestinationStopsSection from "./details-form-card/MuliDestinationStopsSection"
import OneWayStopsSection from "./details-form-card/OneWayStopsSection"
import RoundTripStopsSection from "./details-form-card/RoundTripStopsSection"

const TRIP_TYPES = Object.freeze({
  ROUND_TRIP: "Round Trip",
  ONE_WAY: "One Way",
  MULI_DESTINATION: "Muli-Destination",
})

export default {
  name: "DetailsFormCard",
  components: {
    DatePicker,
    MuliDestinationStopsSection,
    OneWayStopsSection,
    RoundTripStopsSection,
  },
  data: () => ({
    TRIP_TYPES,
    tripTypes: Object.values(TRIP_TYPES),
    tripType: "",
    required: (v) => !!v || "This field is required",
    isNumber: (v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number",
  }),
  computed: {
    ...mapState("travelForm", ["currentForm"]),
    ...mapGetters("travelForm", ["currentFormId"]),
    finalDestination() {
      return last(this.currentForm.stops) || { taid: this.currentFormId }
    },
  },
  mounted() {
    if (this.currentForm.oneWayTrip) {
      this.tripType = TRIP_TYPES.ONE_WAY
    } else if (this.currentForm.multiStop) {
      this.tripType = TRIP_TYPES.MULI_DESTINATION
    } else {
      this.tripType = TRIP_TYPES.ROUND_TRIP
    }
  },
  methods: {
    updateTripType(value) {
      if (value === TRIP_TYPES.ROUND_TRIP) {
        this.currentForm.oneWayTrip = false
        this.currentForm.multiStop = false
      } else if (value === TRIP_TYPES.ONE_WAY) {
        this.currentForm.oneWayTrip = true
        this.currentForm.multiStop = false
      } else if (value === TRIP_TYPES.MULI_DESTINATION) {
        this.currentForm.multiStop = true
        this.currentForm.oneWayTrip = false
      } else {
        throw new Error("Invalid trip type")
      }

      this.tripType = value

      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },
  },
}
</script>
