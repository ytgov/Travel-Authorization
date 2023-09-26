<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="stop1.locationId"
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
          v-model="stop2.locationId"
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
          v-model="stop1.transport"
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
          v-model="stop2.locationId"
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
        <v-autocomplete
          v-model="stop3.locationId"
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
          v-model="stop2.transport"
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
          v-model="stop3.locationId"
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
          v-model="stop4.locationId"
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
          v-model="stop3.transport"
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
  name: "MuliDestinationStopsSection",
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
      this.request.stops.push({})
      this.request.stops.push({})
      this.request.stops.push({})
    } else if (this.request.stops.length === 2) {
      this.request.stops.push({})
      this.request.stops.push({})
    } else if (this.request.stops.length === 3) {
      this.request.stops.push({})
    } else if (this.request.stops.length > 4) {
      this.request.stops = this.request.stops.slice(0, 3)
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
  },
}
</script>
