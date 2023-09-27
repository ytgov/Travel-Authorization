<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="from.locationId"
          :items="destinationsByRequestTravelRestriction"
          :rules="[required]"
          label="From"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="to.locationId"
          :items="destinationsByRequestTravelRestriction"
          :rules="[required]"
          label="To"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          v-model="from.departureDate"
          :rules="[required]"
          text="Date"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <TimePicker
          v-model="from.departureTime"
          :rules="[required]"
          text="Time"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-select
          :value="fromTravelMethod"
          :items="travelMethods"
          :rules="[required]"
          label="Travel Method"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @change="updateFromTravelMethod"
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          v-if="fromTravelMethod === TRAVEL_METHODS.OTHER"
          v-model="from.transport"
          :rules="[required]"
          label="Travel Method - Other:"
          background-color="white"
          dense
          outlined
          required
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"
import { isArray, isEmpty } from "lodash"

import DatePicker from "@/components/Utils/DatePicker"
import TimePicker from "@/components/Utils/TimePicker"

// TODO: abstract this to a shared helper
const TRAVEL_METHODS = Object.freeze({
  AIRCRAFT: "Aircraft",
  POOL_VEHICLE: "Pool Vehicle",
  PERSONAL_VEHICLE: "Personal Vehicle",
  RENTAL_VEHICLE: "Rental Vehicle",
  BUS: "Bus",
  OTHER: "Other:",
})

export default {
  name: "OneWayStopsSection",
  components: {
    DatePicker,
    TimePicker,
  },
  data: () => ({
    required: (v) => !!v || "This field is required",
    fromTravelMethod: TRAVEL_METHODS.AIRCRAFT,
    TRAVEL_METHODS,
    travelMethods: Object.values(TRAVEL_METHODS),
  }),
  computed: {
    ...mapState("travelForm", ["request"]),
    ...mapGetters("travelForm", ["destinationsByRequestTravelRestriction"]),
    from() {
      if (isEmpty(this.request?.stops)) return {}

      return this.request.stops[0]
    },
    to() {
      if (
        isEmpty(this.request?.stops) ||
        (isArray(this.request?.stops) && this.request.stops.length < 2)
      )
        return {}

      return this.request.stops[1]
    },
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.request.stops)) {
      this.request.stops = [{}, {}]
    } else if (this.request.stops.length === 1) {
      this.request.stops.push({})
    } else if (this.request.stops.length > 2) {
      this.request.stops = this.request.stops.slice(0, 2)
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    updateFromTravelMethod(value) {
      this.fromTravelMethod = value

      if (value === TRAVEL_METHODS.OTHER) {
        this.from.transport = ""
      } else {
        this.from.transport = value
      }
    },
  },
}
</script>
