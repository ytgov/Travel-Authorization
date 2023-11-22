<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="stops[0].locationId"
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
          :value="stops[1].locationId"
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
          :value="stops[0].departureDate"
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
          :value="stops[0].departureTime"
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
          :value="stops[0].transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @input="updateStop(0, 'transport', $event)"
        />
        <AccommodationTypeSelect
          :value="stops[0].accommodationType"
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
          :value="stops[1].locationId"
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
          :value="stops[2].locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
          :rules="[required]"
          label="From"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
          @input="updateStop(2, 'locationId', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          :value="stops[1].departureDate"
          :min="stops[0].departureDate"
          :rules="[
            required,
            greaterThanOrEqualToDate(stops[0].departureDate, {
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
          :value="stops[1].departureTime"
          :rules="[required]"
          label="Time (24 hour)"
          persistent-hint
          @input="updateStop(1, 'departureTime', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          :value="stops[1].transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @input="updateStop(1, 'transport', $event)"
        />
        <AccommodationTypeSelect
          :value="stops[1].accommodationType"
          :rules="[required]"
          background-color="white"
          dense
          outlined
          required
          @input="updateStop(1, 'accommodationType', $event)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="stops[2].locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
          :rules="[required]"
          label="From"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
          @input="updateStop(2, 'locationId', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="stops[3].locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
          :rules="[required]"
          label="To"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
          @input="updateStop(3, 'locationId', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          :value="stops[2].departureDate"
          :min="stops[1].departureDate"
          :rules="[
            required,
            greaterThanOrEqualToDate(stops[1].departureDate, {
              referenceFieldLabel: 'previous departure date',
            }),
          ]"
          label="Date"
          persistent-hint
          @input="updateStop(2, 'departureDate', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <TimePicker
          :value="stops[2].departureTime"
          :rules="[required]"
          label="Time (24 hour)"
          persistent-hint
          @input="updateStop(2, 'departureTime', $event)"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          :value="stops[2].transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
          @input="updateStop(2, 'transport', $event)"
        />
        <AccommodationTypeSelect
          :value="stops[2].accommodationType"
          :default-value="null"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          background-color="white"
          clearable
          dense
          outlined
          persistent-hint
          @input="updateStop(2, 'accommodationType', $event)"
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
  name: "MultiDestinationStopsSection",
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
    }),
  },
  async mounted() {},
  methods: {
    required,
    greaterThanOrEqualToDate,
    ...mapActions("current/travelAuthorization", ["replaceStops"]),
    async updateStop(index, attribute, value) {
      this.stops.splice(index, 1, { ...this.stops[index], [attribute]: value })
      // this.replaceStops(this.stops) might not need this?
    },
  },
}
</script>
