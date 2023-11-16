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
          v-if="tripTypeComponent"
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
              :min="finalDestination.departureDate"
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
import { isEmpty, last } from "lodash"
import { mapState, mapGetters } from "vuex"

import { required } from "@/utils/validators"
import { ACCOMMODATION_TYPES } from "@/modules/travel-authorizations/components/AccommodationTypeSelect"
import { TRAVEL_METHODS } from "@/modules/travel-authorizations/components/TravelMethodSelect"
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
    stopsCache: {
      [TRIP_TYPES.ROUND_TRIP]: [],
      [TRIP_TYPES.ONE_WAY]: [],
      [TRIP_TYPES.MULTI_DESTINATION]: [],
    },
  }),
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization"]),
    ...mapGetters("travelAuthorizations", ["currentTravelAuthorizationId"]),
    finalDestination() {
      return last(this.currentTravelAuthorization.stops) || {}
    },
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
  },
  mounted() {
    if (this.currentTravelAuthorization.oneWayTrip) {
      this.updateTripType(TRIP_TYPES.ONE_WAY)
    } else if (this.currentTravelAuthorization.multiStop) {
      this.updateTripType(TRIP_TYPES.MULTI_DESTINATION)
    } else {
      this.updateTripType(TRIP_TYPES.ROUND_TRIP)
    }
  },
  methods: {
    required,
    /*
      Update trip type selection, setting default stops as needed,
      or loading stops from cache if cached valued exists.

      Use of a cache permits stops to have a blank accomodation or trip type,
      against a variety of stop configurations, without wiping stop content on trip type change.

      NOTE: This would probably be made irrelevant by modeling stops differently, such as by
      using a "trip segment" model, with a departure and arrival location.
    */
    updateTripType(value) {
      this.stopsCache[this.tripType] = this.currentTravelAuthorization.stops

      if (value === TRIP_TYPES.ROUND_TRIP) {
        this.currentTravelAuthorization.oneWayTrip = false
        this.currentTravelAuthorization.multiStop = false

        this.currentTravelAuthorization.stops = this.getStopsFromCacheOrDefault(
          TRIP_TYPES.ROUND_TRIP,
          [
            this.newStop(),
            this.newStop({
              ...this.finalDestination,
              accommodationType: null,
              transport: null,
            }),
          ]
        )
      } else if (value === TRIP_TYPES.ONE_WAY) {
        this.currentTravelAuthorization.oneWayTrip = true
        this.currentTravelAuthorization.multiStop = false

        this.currentTravelAuthorization.stops = this.getStopsFromCacheOrDefault(
          TRIP_TYPES.ONE_WAY,
          [
            this.newStop({ accommodationType: null }),
            this.newStop({
              ...this.finalDestination,
              accommodationType: null,
              transport: null,
            }),
          ]
        )
      } else if (value === TRIP_TYPES.MULTI_DESTINATION) {
        this.currentTravelAuthorization.multiStop = true
        this.currentTravelAuthorization.oneWayTrip = false

        this.currentTravelAuthorization.stops = this.getStopsFromCacheOrDefault(
          TRIP_TYPES.MULTI_DESTINATION,
          [
            this.newStop(),
            this.newStop(),
            this.newStop({ accommodationType: null }),
            this.newStop({
              ...this.finalDestination,
              accommodationType: null,
              transport: null,
            }),
          ]
        )
      } else {
        throw new Error("Invalid trip type")
      }

      this.tripType = value

      this.$nextTick(() => {
        this.$refs.form?.resetValidation()
      })
    },
    getStopsFromCacheOrDefault(key, defaultStops) {
      const cachedStops = this.stopsCache[key]
      if (isEmpty(cachedStops)) return defaultStops

      return cachedStops
    },
    newStop(attributes) {
      return {
        travelAuthorizationId: this.currentTravelAuthorizationId,
        accommodationType: ACCOMMODATION_TYPES.HOTEL,
        transport: TRAVEL_METHODS.AIRCRAFT,
        ...attributes,
      }
    },
  },
}
</script>
