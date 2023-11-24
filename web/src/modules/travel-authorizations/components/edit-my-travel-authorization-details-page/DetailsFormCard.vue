<template>
  <v-card elevation="2">
    <v-card-title> Details </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              :value="tripType"
              :items="tripTypes"
              :rules="[required]"
              label="Trip Type"
              dense
              outlined
              required
              @change="updateTripType"
            ></v-select>
          </v-col>
        </v-row>

        <component
          :is="tripTypeComponent"
          v-if="tripTypeComponent && hasEnoughStops"
        />
        <div v-else>Trip type {{ tripType }} not implemented!</div>
        <v-row>
          <v-col
            cols="12"
            md="1"
          >
            <TravelDurationTextField
              v-model="currentTravelAuthorization.travelDuration"
              :stops="currentTravelAuthorization.stops"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-text-field
              v-model="currentTravelAuthorization.daysOffTravelStatus"
              :rules="[isNumber]"
              label="Days on non-travel status"
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
              v-model="currentTravelAuthorization.dateBackToWork"
              :min="lastStop.departureDate"
              :rules="[required]"
              label="Expected Date return to work"
              required
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import { ACCOMMODATION_TYPES, TRAVEL_METHODS } from "@/api/stops-api"
import { required } from "@/utils/validators"
import DatePicker from "@/components/Utils/DatePicker"
import TravelDurationTextField from "./details-form-card/TravelDurationTextField.vue"

const TRIP_TYPES = Object.freeze({
  ROUND_TRIP: "Round Trip",
  ONE_WAY: "One Way",
  MULTI_DESTINATION: "Multi-Destination",
})

export default {
  name: "DetailsFormCard",
  components: {
    DatePicker,
    TravelDurationTextField,
  },
  data: () => ({
    TRIP_TYPES,
    tripTypes: Object.values(TRIP_TYPES),
    tripType: "",
    isNumber: (v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number",
  }),
  computed: {
    ...mapGetters("current/travelAuthorization", {
      currentTravelAuthorization: "attributes",
      stops: "stops",
      firstStop: "firstStop",
      lastStop: "lastStop",
    }),
    tripTypeComponent() {
      switch (this.tripType) {
        case TRIP_TYPES.ROUND_TRIP:
          return () => import("./details-form-card/RoundTripStopsSection")
        case TRIP_TYPES.ONE_WAY:
          return () => import("./details-form-card/OneWayStopsSection")
        case TRIP_TYPES.MULTI_DESTINATION:
          return () => import("./details-form-card/MultiDestinationStopsSection")
        default:
          return null
      }
    },
    hasEnoughStops() {
      switch (this.tripType) {
        case TRIP_TYPES.ROUND_TRIP:
          return this.stops.length === 2
        case TRIP_TYPES.ONE_WAY:
          return this.stops.length === 2
        case TRIP_TYPES.MULTI_DESTINATION:
          return this.stops.length === 4
        default:
          return true
      }
    },
  },
  async mounted() {
    if (this.currentTravelAuthorization.oneWayTrip) {
      this.tripType = TRIP_TYPES.ONE_WAY
    } else if (this.currentTravelAuthorization.multiStop) {
      this.tripType = TRIP_TYPES.MULTI_DESTINATION
    } else {
      this.tripType = TRIP_TYPES.ROUND_TRIP
    }

    this.$nextTick(() => {
      this.$refs.form?.resetValidation()
    })
  },
  methods: {
    required,
    ...mapActions("current/travelAuthorization", ["newBlankStop", "replaceStops"]),
    async updateTripType(value) {
      this.tripType = value
      if (value === TRIP_TYPES.ROUND_TRIP) {
        this.currentTravelAuthorization.oneWayTrip = false
        this.currentTravelAuthorization.multiStop = false
      } else if (value === TRIP_TYPES.ONE_WAY) {
        this.currentTravelAuthorization.oneWayTrip = true
        this.currentTravelAuthorization.multiStop = false
      } else if (value === TRIP_TYPES.MULTI_DESTINATION) {
        this.currentTravelAuthorization.multiStop = true
        this.currentTravelAuthorization.oneWayTrip = false
      } else {
        throw new Error("Invalid trip type")
      }

      await this.ensureMinimalDefaultStops(this.tripType)

      this.$nextTick(() => {
        this.$refs.form?.resetValidation()
      })
    },
    async ensureMinimalDefaultStops(tripType) {
      if (tripType === TRIP_TYPES.ROUND_TRIP) {
        return this.ensureMinimalDefaultRoundTripStops()
      } else if (tripType === TRIP_TYPES.ONE_WAY) {
        return this.ensureMinimalDefaultOneWayStops()
      } else if (tripType === TRIP_TYPES.MULTI_DESTINATION) {
        return this.ensureMinimalDefaultMultiDestinationStops()
      } else {
        throw new Error("Invalid trip type")
      }
    },
    async ensureMinimalDefaultRoundTripStops() {
      const newFirstStop = await this.newBlankStop({
        accommodationType: ACCOMMODATION_TYPES.HOTEL,
        transport: TRAVEL_METHODS.AIRCRAFT,
        ...this.firstStop,
      })
      const newLastStop = await this.newBlankStop({
        ...this.lastStop,
        transport: TRAVEL_METHODS.AIRCRAFT,
        accommodationType: null,
      })
      return this.replaceStops([newFirstStop, newLastStop])
    },
    async ensureMinimalDefaultOneWayStops() {
      const newFirstStop = await this.newBlankStop({
        ...this.firstStop,
        accommodationType: null,
        transport: TRAVEL_METHODS.AIRCRAFT,
      })
      const newLastStop = await this.newBlankStop({
        ...this.lastStop,
        transport: null,
        accommodationType: null,
      })
      return this.replaceStops([newFirstStop, newLastStop])
    },
    async ensureMinimalDefaultMultiDestinationStops() {
      const newFirstStop = await this.newBlankStop({
        transport: TRAVEL_METHODS.AIRCRAFT,
        ...this.firstStop,
        accommodationType: this.firstStop.accommodationType || ACCOMMODATION_TYPES.HOTEL,
      })
      const secondStop = this.stops[1] !== this.lastStop ? this.stops[1] : {}
      const newSecondStop = await this.newBlankStop({
        accommodationType: ACCOMMODATION_TYPES.HOTEL,
        transport: TRAVEL_METHODS.AIRCRAFT,
        ...secondStop,
      })
      const newThirdStop = await this.newBlankStop({
        accommodationType: null,
        transport: TRAVEL_METHODS.AIRCRAFT,
      })
      const newLastStop = await this.newBlankStop({
        ...this.lastStop,
        transport: null,
        accommodationType: null,
      })
      return this.replaceStops([newFirstStop, newSecondStop, newThirdStop, newLastStop])
    },
  },
}
</script>
