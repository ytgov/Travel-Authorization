<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <LocationsAutocomplete
          :value="firstStop.locationId"
          :in-territory="allTravelWithinTerritory"
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
          :in-territory="allTravelWithinTerritory"
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
          :in-territory="allTravelWithinTerritory"
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
          :in-territory="allTravelWithinTerritory"
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
          :value="stops[1].departureTime"
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
          :in-territory="allTravelWithinTerritory"
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
          :value="lastStop.locationId"
          :in-territory="allTravelWithinTerritory"
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

<script setup>
import { computed } from "vue"

import { required, greaterThanOrEqualToDate } from "@/utils/validators"

import DatePicker from "@/components/Utils/DatePicker"
import LocationsAutocomplete from "@/components/locations/LocationsAutocomplete"
import TimePicker from "@/components/Utils/TimePicker"
import AccommodationTypeSelect from "@/modules/travel-authorizations/components/AccommodationTypeSelect"
import TravelMethodSelect from "@/modules/travel-authorizations/components/TravelMethodSelect"

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  allTravelWithinTerritory: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["input"])

const firstStop = computed(() => props.value[0] || {})
const lastStop = computed(() => props.value[props.value.length - 1] || {})

async function updateStop(index, attribute, value) {
  const updatedStops = props.value.map((stop, i) =>
    i === index ? { ...stop, [attribute]: value } : stop
  )

  emit("input", updatedStops)
}
</script>
