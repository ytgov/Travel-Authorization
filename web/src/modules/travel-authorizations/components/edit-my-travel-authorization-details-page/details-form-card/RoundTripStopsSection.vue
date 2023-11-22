<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="firstStop.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
          :rules="[required]"
          label="From"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
          @input="updateStop(0, 'locationId', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="lastStop.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
          :rules="[required]"
          label="To"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
          @input="updateStop(1, 'locationId', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          :value="firstStop.departureDate"
          :rules="[required]"
          label="Date"
          persistent-hint
          @input="updateStop(0, 'departureDate', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <TimePicker
          :value="firstStop.departureTime"
          :rules="[required]"
          label="Time (24h)"
          persistent-hint
          @input="updateStop(0, 'departureTime', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          :value="firstStop.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @input="updateStop(0, 'transport', $event)"
        />
        <AccommodationTypeSelect
          :value="firstStop.accommodationType"
          :rules="[required]"
          background-color="white"
          dense
          outlined
          required
          @input="updateStop(0, 'accommodationType', $event)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="lastStop.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
          :rules="[required]"
          label="To"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
          @input="updateStop(1, 'locationId', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="firstStop.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
          :rules="[required]"
          label="From"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
          @input="updateStop(0, 'locationId', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          :value="lastStop.departureDate"
          :min="firstStop.departureDate"
          :rules="[
            required,
            greaterThanOrEqualToDate(firstStop.departureDate, {
              referenceFieldLabel: 'previous departure date',
            }),
          ]"
          label="Date"
          persistent-hint
          @input="updateStop(1, 'departureDate', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <TimePicker
          :value="lastStop.departureTime"
          :rules="[required]"
          label="Time (24h)"
          persistent-hint
          @input="updateStop(1, 'departureTime', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          :value="lastStop.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @input="updateStop(1, 'transport', $event)"
        />
        <AccommodationTypeSelect
          :value="lastStop.accommodationType"
          :default-value="null"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          background-color="white"
          clearable
          dense
          outlined
          persistent-hint
          @input="updateStop(1, 'accommodationType', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import { required, greaterThanOrEqualToDate } from "@/utils/validators"

import DatePicker from "@/components/Utils/DatePicker"
import LocationsAutocomplete from "@/components/LocationsAutocomplete"
import TimePicker from "@/components/Utils/TimePicker"
import AccommodationTypeSelect from "@/modules/travel-authorizations/components/AccommodationTypeSelect"
import TravelMethodSelect from "@/modules/travel-authorizations/components/TravelMethodSelect"

export default {
  name: "RoundTripStopsSection",
  components: {
    AccommodationTypeSelect,
    DatePicker,
    LocationsAutocomplete,
    TimePicker,
    TravelMethodSelect,
  },
  data: () => ({}),
  computed: {
    ...mapGetters("current/travelAuthorization", {
      currentTravelAuthorization: "attributes",
      stops: "stops",
      firstStop: "firstStop",
      lastStop: "lastStop",
    }),
  },
  async mounted() {},
  methods: {
    greaterThanOrEqualToDate,
    required,
    ...mapActions("current/travelAuthorization", ["replaceStops"]),
    async updateStop(index, attribute, value) {
      const updatedStops = this.stops.map((stop, i) =>
        i === index ? { ...stop, [attribute]: value } : stop
      )
      return this.replaceStops(updatedStops)
    },
  },
}
</script>
