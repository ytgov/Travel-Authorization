<template>
  <v-card elevation="2">
    <v-card-title> Details </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="tripType"
            label="Trip Type"
            dense
            outlined
            readonly
          ></v-text-field>
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
          <v-text-field
            :value="travelAuthorization.travelDuration"
            label="# Days"
            dense
            outlined
            readonly
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelAuthorization.daysOffTravelStatus"
            label="Days on non-travel status"
            dense
            outlined
            readonly
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelAuthorization.dateBackToWork"
            label="Expected Date return to work"
            prepend-icon="mdi-calendar"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex"

const TRIP_TYPES = Object.freeze({
  ROUND_TRIP: "Round Trip",
  ONE_WAY: "One Way",
  MULTI_DESTINATION: "Multi-Destination",
})

export default {
  name: "DetailsCard",
  components: {},
  data: () => ({
    tripType: "",
  }),
  computed: {
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      travelAuthorizationId: "id",
    }),
    tripTypeComponent() {
      switch (this.tripType) {
        case TRIP_TYPES.ROUND_TRIP:
          return () => import("./details-card/RoundTripStopsSection")
        case TRIP_TYPES.ONE_WAY:
          return () => import("./details-card/OneWayStopsSection")
        case TRIP_TYPES.MULTI_DESTINATION:
          return () => import("./details-card/MultiDestinationStopsSection")
        default:
          return null
      }
    },
  },
  mounted() {
    if (this.travelAuthorization.oneWayTrip) {
      this.tripType = TRIP_TYPES.ONE_WAY
    } else if (this.travelAuthorization.multiStop) {
      this.tripType = TRIP_TYPES.MULTI_DESTINATION
    } else {
      this.tripType = TRIP_TYPES.ROUND_TRIP
    }
  },
}
</script>
