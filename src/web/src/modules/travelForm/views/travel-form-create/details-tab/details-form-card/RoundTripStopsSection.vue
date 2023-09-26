<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="from.locationId"
          :items="destinations"
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
          :items="destinations"
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
          v-model="from.transport"
          :items="travelMethods"
          :rules="[required]"
          label="Travel Method"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="to.locationId"
          :items="destinations"
          :rules="[required]"
          label="to"
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
          v-model="from.locationId"
          :items="destinations"
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
          v-model="to.departureDate"
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
          v-model="to.departureTime"
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
          v-model="to.transport"
          :items="travelMethods"
          :rules="[required]"
          label="Travel Method"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { isArray, isEmpty } from "lodash"

import DatePicker from "@/components/Utils/DatePicker"
import TimePicker from "@/components/Utils/TimePicker"

const TRAVEL_METHODS = Object.freeze({
  RENTAL_VEHICLE: "Rental vehicle",
  PERSONAL_VEHICLE: "Personal vehicle",
  FLEET_VEHICLE: "Fleet vehicle",
  PLANE: "Plane",
})

export default {
  name: "RoundTripStopsSection",
  components: {
    DatePicker,
    TimePicker,
  },
  data: () => ({
    required: (v) => !!v || "This field is required",
    TRAVEL_METHODS,
    travelMethods: Object.values(TRAVEL_METHODS),
  }),
  computed: {
    ...mapState("travelForm", ["destinations", "request"]),
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
  },
}
</script>
