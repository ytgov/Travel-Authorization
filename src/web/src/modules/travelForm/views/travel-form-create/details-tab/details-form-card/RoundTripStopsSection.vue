<template>
  <div>
    <v-row
      v-for="(stop, index) in stops"
      :key="`stop-${index}`"
    >
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="stop.locationId"
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
          v-model="stop.locationId"
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
          v-model="stop.departureDate"
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
          v-model="stop.departureTime"
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
          v-model="stop.transport"
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
    stops: [{}, {}],
    required: (v) => !!v || "This field is required",
    TRAVEL_METHODS,
    travelMethods: Object.values(TRAVEL_METHODS),
  }),
  computed: {
    ...mapState("travelForm", ["destinations"]),
  },
  async mounted() {
    await this.loadDestinations()
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
  },
}
</script>
