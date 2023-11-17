<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          v-model="originStop.locationId"
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
          v-model="destinationStop.locationId"
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
          v-model="originStop.departureDate"
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
          v-model="originStop.departureTime"
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
          v-model="originStop.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="originStop.accommodationType"
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
import { mapState, mapGetters } from "vuex"

import { required } from "@/utils/validators"

import DatePicker from "@/components/Utils/DatePicker"
import LocationsAutocomplete from "@/components/LocationsAutocomplete"
import TimePicker from "@/components/Utils/TimePicker"
import AccommodationTypeSelect from "@/modules/travel-authorizations/components/AccommodationTypeSelect"
import TravelMethodSelect from "@/modules/travel-authorizations/components/TravelMethodSelect"

export default {
  name: "OneWayStopsSection",
  components: {
    AccommodationTypeSelect,
    DatePicker,
    LocationsAutocomplete,
    TimePicker,
    TravelMethodSelect,
  },
  data() {
    return {
      originStop: {},
      destinationStop: {},
    }
  },
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization"]),
    ...mapGetters("travelAuthorizations", ["currentTravelAuthorizationId"]),
  },
  async mounted() {
    this.originStop = this.currentTravelAuthorization.stops[0]
    this.destinationStop = this.currentTravelAuthorization.stops[1]
  },
  methods: {
    required,
  },
}
</script>
