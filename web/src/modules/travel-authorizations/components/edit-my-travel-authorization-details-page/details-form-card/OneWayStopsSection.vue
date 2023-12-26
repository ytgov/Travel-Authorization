<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="firstStop.locationId"
          :in-territory="travelAuthorization.allTravelWithinTerritory"
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
          :in-territory="travelAuthorization.allTravelWithinTerritory"
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
          :default-value="null"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          background-color="white"
          clearable
          dense
          outlined
          persistent-hint
          @input="updateStop(0, 'accommodationType', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

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
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      stops: "stops",
      firstStop: "firstStop",
      lastStop: "lastStop",
    }),
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
  },
  methods: {
    required,
    ...mapActions("travelAuthorization", {
      replaceStops: "replaceStops",
      ensureTravelAuthorization: "ensure",
    }),
    async updateStop(index, attribute, value) {
      const updatedStops = this.stops.map((stop, i) =>
        i === index ? { ...stop, [attribute]: value } : stop
      )
      return this.replaceStops(updatedStops)
    },
  },
}
</script>
