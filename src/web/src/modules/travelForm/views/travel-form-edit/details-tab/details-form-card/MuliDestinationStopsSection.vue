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
    ...mapState("travelForm", ["currentForm"]),
    ...mapGetters("travelForm", ["currentFormId", "destinationsByCurrentFormTravelRestriction"]),
    stop1() {
      if (isEmpty(this.currentForm?.stops)) return this.newStop()

      return this.currentForm.stops[0]
    },
    stop2() {
      if (
        isEmpty(this.currentForm?.stops) ||
        (isArray(this.currentForm?.stops) && this.currentForm.stops.length < 2)
      )
        return this.newStop()

      return this.currentForm.stops[1]
    },
    stop3() {
      if (
        isEmpty(this.currentForm?.stops) ||
        (isArray(this.currentForm?.stops) && this.currentForm.stops.length < 3)
      )
        return this.newStop()

      return this.currentForm.stops[2]
    },
    stop4() {
      if (
        isEmpty(this.currentForm?.stops) ||
        (isArray(this.currentForm?.stops) && this.currentForm.stops.length < 4)
      )
        return this.newStop()

      return this.currentForm.stops[3]
    },
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.currentForm.stops)) {
      this.currentForm.stops = [this.newStop(), this.newStop(), this.newStop(), this.newStop()]
    } else if (this.currentForm.stops.length === 1) {
      this.currentForm.stops.splice(0, 0, this.newStop(), this.newStop(), this.newStop())
    } else if (this.currentForm.stops.length === 2) {
      this.currentForm.stops.splice(1, 0, this.newStop(), this.newStop())
    } else if (this.currentForm.stops.length === 3) {
      this.currentForm.stops.splice(2, 0, this.newStop())
    } else if (this.currentForm.stops.length > 4) {
      this.currentForm.stops = this.currentForm.stops.slice(0, 3)
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    newStop() {
      return { formId: this.currentFormId }
    },
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
