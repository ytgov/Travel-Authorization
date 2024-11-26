<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :value="stop1.locationId"
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
          :value="stop2.locationId"
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
          :value="stop1.departureDate"
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
          :value="stop1.departureTime"
          label="Time"
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
          :value="stop1.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
          append-icon="mdi-lock"
        />
        <v-text-field
          :value="stop1.accommodationType"
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
          :value="stop2.locationId"
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
          :value="stop3.locationId"
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
          :value="stop2.departureDate"
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
          :value="stop2.departureTime"
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
          :value="stop2.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
          append-icon="mdi-lock"
        />
        <v-text-field
          :value="stop2.accommodationType"
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
          :value="stop3.locationId"
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
          :value="stop4.locationId"
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
          :value="stop3.departureDate"
          text="Date"
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
          :value="stop3.departureTime"
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
          :value="stop3.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
          append-icon="mdi-lock"
        />
        <v-text-field
          :value="stop3.accommodationType"
          label="Type of Accommodation"
          dense
          outlined
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { toRefs, computed } from "vue"

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

const stop1 = computed(() => travelAuthorization.value.stops[0] || {})
const stop2 = computed(() => travelAuthorization.value.stops[1] || {})
const stop3 = computed(() => travelAuthorization.value.stops[2] || {})
const stop4 = computed(() => travelAuthorization.value.stops[3] || {})
</script>
