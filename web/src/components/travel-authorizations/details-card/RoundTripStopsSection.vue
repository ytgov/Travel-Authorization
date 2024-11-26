<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :location-id="originStop.locationId"
          label="From"
          dense
          outlined
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :location-id="destinationStop.locationId"
          label="To"
          dense
          outlined
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="originStop.departureDate"
          label="Date"
          prepend-icon="mdi-calendar"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="originStop.departureTime"
          label="Time (24h)"
          prepend-icon="mdi-clock"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          :value="originStop.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
          append-icon="mdi-lock"
        />
        <v-text-field
          :value="originStop.accommodationType"
          label="Type of Accommodation"
          dense
          outlined
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :location-id="destinationStop.locationId"
          label="To"
          dense
          outlined
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :location-id="originStop.locationId"
          label="From"
          dense
          outlined
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="destinationStop.departureDate"
          label="Date"
          prepend-icon="mdi-calendar"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="destinationStop.departureTime"
          label="Time (24h)"
          prepend-icon="mdi-clock"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          :value="destinationStop.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
          append-icon="mdi-lock"
        />
        <v-text-field
          :value="destinationStop.accommodationType"
          label="Type of Accommodation"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue"

import useTravelAuthorization from "@/use/use-travel-authorization"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const originStop = computed(() => travelAuthorization.value.stops[0] || {})
const destinationStop = computed(() => travelAuthorization.value.stops[1] || {})
</script>
