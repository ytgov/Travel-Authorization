<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          v-model="stop1.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
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
        <LocationsAutocomplete
          v-model="stop2.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
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
          label="Date"
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
          label="Time (24h)"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="stop1.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="stop1.accommodationType"
          :rules="[required]"
          background-color="white"
          dense
          outlined
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          v-model="stop2.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
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
        <LocationsAutocomplete
          v-model="stop3.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
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
          :min="stop1.departureDate"
          :rules="[
            required,
            greaterThanOrEqualToDate(stop1.departureDate, {
              referenceFieldLabel: 'previous departure date',
            }),
          ]"
          label="Date"
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
          label="Time (24 hour)"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="stop2.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="stop2.accommodationType"
          :rules="[required]"
          background-color="white"
          dense
          outlined
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          v-model="stop3.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
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
        <LocationsAutocomplete
          v-model="stop4.locationId"
          :in-territory="currentTravelAuthorization.allTravelWithinTerritory"
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
          :min="stop2.departureDate"
          :rules="[
            required,
            greaterThanOrEqualToDate(stop2.departureDate, {
              referenceFieldLabel: 'previous departure date',
            }),
          ]"
          label="Date"
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
          label="Time (24 hour)"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="stop3.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="stop3.accommodationType"
          :default-value="null"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          background-color="white"
          clearable
          dense
          outlined
          persistent-hint
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

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
  data() {
    return {
      stop1: {},
      stop2: {},
      stop3: {},
      stop4: {},
    }
  },
  computed: {
    ...mapGetters("current/travelAuthorization", {
      currentTravelAuthorization: "attributes",
      currentTravelAuthorizationId: "id",
    }),
  },
  async mounted() {
    this.stop1 = this.currentTravelAuthorization.stops[0]
    this.stop2 = this.currentTravelAuthorization.stops[1]
    this.stop3 = this.currentTravelAuthorization.stops[2]
    this.stop4 = this.currentTravelAuthorization.stops[3]
  },
  methods: {
    required,
    greaterThanOrEqualToDate,
  },
}
</script>
