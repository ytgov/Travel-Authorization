<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="stop1.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
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
          v-model="stop2.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
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
          v-model="stop1.departureDate"
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
          v-model="stop1.departureTime"
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
          :value="stop1TravelMethod"
          :items="travelMethods"
          :rules="[required]"
          label="Travel Method"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @change="updateStop1TravelMethod"
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          v-if="stop1TravelMethod === TRAVEL_METHODS.OTHER"
          v-model="stop1.transport"
          :rules="[required]"
          label="Travel Method - Other:"
          background-color="white"
          dense
          outlined
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="stop2.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
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
        <v-autocomplete
          v-model="stop3.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
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
        <DatePicker
          v-model="stop2.departureDate"
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
          v-model="stop2.departureTime"
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
          :value="stop2TravelMethod"
          :items="travelMethods"
          :rules="[required]"
          label="Travel Method"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @change="updateStop2TravelMethod"
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          v-if="stop2TravelMethod === TRAVEL_METHODS.OTHER"
          v-model="stop2.transport"
          :rules="[required]"
          label="Travel Method - Other:"
          background-color="white"
          dense
          outlined
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="stop3.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
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
          v-model="stop4.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
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
          v-model="stop3.departureDate"
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
          v-model="stop3.departureTime"
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
          :value="stop3TravelMethod"
          :items="travelMethods"
          :rules="[required]"
          label="Travel Method"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @change="updateStop3TravelMethod"
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          v-if="stop3TravelMethod === TRAVEL_METHODS.OTHER"
          v-model="stop3.transport"
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
  name: "MuliDestinationStopsSection",
  components: {
    DatePicker,
    TimePicker,
  },
  data: () => ({
    required: (v) => !!v || "This field is required",
    stop1TravelMethod: TRAVEL_METHODS.AIRCRAFT,
    stop2TravelMethod: TRAVEL_METHODS.AIRCRAFT,
    stop3TravelMethod: TRAVEL_METHODS.AIRCRAFT,
    TRAVEL_METHODS,
    travelMethods: Object.values(TRAVEL_METHODS),
  }),
  computed: {
    ...mapState("travelForm", ["request"]),
    ...mapGetters("travelForm", ["destinationsByCurrentFormTravelRestriction"]),
    stop1() {
      if (isEmpty(this.request?.stops)) return {}

      return this.request.stops[0]
    },
    stop2() {
      if (
        isEmpty(this.request?.stops) ||
        (isArray(this.request?.stops) && this.request.stops.length < 2)
      )
        return {}

      return this.request.stops[1]
    },
    stop3() {
      if (
        isEmpty(this.request?.stops) ||
        (isArray(this.request?.stops) && this.request.stops.length < 3)
      )
        return {}

      return this.request.stops[2]
    },
    stop4() {
      if (
        isEmpty(this.request?.stops) ||
        (isArray(this.request?.stops) && this.request.stops.length < 4)
      )
        return {}

      return this.request.stops[3]
    },
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.request.stops)) {
      this.request.stops = [{}, {}, {}, {}]
    } else if (this.request.stops.length === 1) {
      this.request.stops.splice(0, 0, {}, {}, {});
    } else if (this.request.stops.length === 2) {
      this.request.stops.splice(1, 0, {}, {});
    } else if (this.request.stops.length === 3) {
      this.request.stops.splice(2, 0, {});
    } else if (this.request.stops.length > 4) {
      this.request.stops = this.request.stops.slice(0, 3)
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    updateStop1TravelMethod(value) {
      this.stop1TravelMethod = value

      if (value === TRAVEL_METHODS.OTHER) {
        this.stop1.transport = ""
      } else {
        this.stop1.transport = value
      }
    },
    updateStop2TravelMethod(value) {
      this.stop2TravelMethod = value

      if (value === TRAVEL_METHODS.OTHER) {
        this.stop2.transport = ""
      } else {
        this.stop2.transport = value
      }
    },
    updateStop3TravelMethod(value) {
      this.stop3TravelMethod = value

      if (value === TRAVEL_METHODS.OTHER) {
        this.stop3.transport = ""
      } else {
        this.stop3.transport = value
      }
    },
  },
}
</script>
