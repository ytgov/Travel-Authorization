<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="from.locationId"
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
          v-model="to.locationId"
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
    ...mapState("travelForm", ["currentForm"]),
    ...mapGetters("travelForm", ["currentFormId", "destinationsByCurrentFormTravelRestriction"]),
    from() {
      if (isEmpty(this.currentForm?.stops)) return this.newStop()

      return this.currentForm.stops[0]
    },
    to() {
      if (
        isEmpty(this.currentForm?.stops) ||
        (isArray(this.currentForm?.stops) && this.currentForm.stops.length < 2)
      )
        return this.newStop()

      return this.currentForm.stops[1]
    },
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.currentForm.stops)) {
      this.currentForm.stops = [this.newStop(), this.newStop()]
    } else if (this.currentForm.stops.length === 1) {
      this.currentForm.stops.push(this.newStop())
    } else if (this.currentForm.stops.length > 2) {
      const elementsToRemove = this.currentForm.stops.length - 2
      this.currentForm.stops.splice(1, elementsToRemove)
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    newStop() {
      return { formId: this.currentFormId }
    },
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
