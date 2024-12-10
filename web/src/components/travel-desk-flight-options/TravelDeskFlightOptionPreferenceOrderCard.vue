<template>
  <v-card
    class="card--outlined"
    :loading="isLoading"
  >
    <v-card-title>
      <h5>{{ title }}</h5>
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>

    <v-divider />

    <v-card-text class="mt-4 px-0 px-md-4">
      <v-row
        v-for="(flightOption, index) in travelDeskFlightOptions"
        :key="flightOption.id"
      >
        <v-col
          cols="12"
          md="3"
          :class="{
            'mt-4 mt-md-0': index !== 0,
          }"
        >
          <FlightPreferenceOrderSelect
            :value="flightOption.preferenceOrder"
            label="Preference"
            outlined
            :number-of-options="travelDeskFlightOptions.length"
            :hide-details="$vuetify.breakpoint.smAndDown"
          />
        </v-col>

        <v-col
          cols="12"
          md="9"
        >
          <TravelDeskFlightSegmentsCard
            :travel-desk-flight-option-id="flightOption.id"
            :cost="flightOption.cost"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"

import useTravelDeskFlightOptions from "@/use/use-travel-desk-flight-options"

import FlightPreferenceOrderSelect from "@/components/travel-desk-flight-options/FlightPreferenceOrderSelect.vue"
import TravelDeskFlightSegmentsCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsCard.vue"

const props = defineProps({
  travelDeskFlightRequestId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})

const travelDeskFlightOptionsQuery = computed(() => ({
  where: {
    flightRequestId: props.travelDeskFlightRequestId,
  },
}))
const { travelDeskFlightOptions, isLoading } = useTravelDeskFlightOptions(
  travelDeskFlightOptionsQuery
)
</script>
