<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="card"
  />
  <v-card v-else>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-select
            label="Preference"
            :value="flightOption.flightPreferenceOrder"
            :items="flightPreferences"
            :hint="
              flightOption.flightPreferenceOrder === DOES_NOT_WORK
                ? 'Please see the Additional Information.'
                : ''
            "
            persistent-hint
            readonly
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            label="Cost"
            :value="`$ ${flightOption.cost}`"
            readonly
          />
        </v-col>
      </v-row>
      <v-row
        v-for="(flightSegment, inx) in travelDeskFlightSegments"
        :key="'segment-' + flightSegment.id + '-' + inx"
      >
        <v-col cols="12">
          <v-list density="compact">
            <v-subheader>{{ flightSegment.flightNumber }}</v-subheader>
            <v-list-item>
              <v-list-item-content> Departure: </v-list-item-content>
              <v-list-item-content align="end">
                {{ flightSegment.departLocation }}
                <br />
                {{ formatDate(flightSegment.departAt, "ccc, dd LLL yyyy 'at' HH:mm z") }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content> Arrival: </v-list-item-content>
              <v-list-item-content align="end">
                {{ flightSegment.arriveLocation }}
                <br />
                {{ formatDate(flightSegment.arriveAt, "ccc, dd LLL yyyy 'at' HH:mm z") }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content> Duration: </v-list-item-content>
              <v-list-item-content align="end">
                {{ flightSegment.duration }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { times } from "lodash"

import formatDate from "@/utils/format-date"
import useTravelDeskFlightSegments from "@/use/use-travel-desk-flight-segments"

const props = defineProps({
  flightOption: {
    type: Object,
    required: true,
  },
  optLen: {
    type: Number,
    required: true,
  },
})

const travelDeskFlightSegmentsQuery = computed(() => ({
  where: {
    flightOptionId: props.flightOption.id,
  },
}))
const { travelDeskFlightSegments, isLoading } = useTravelDeskFlightSegments(
  travelDeskFlightSegmentsQuery
)

const DOES_NOT_WORK = 0

const flightPreferences = computed(() => {
  return [
    {
      value: DOES_NOT_WORK,
      text: "Does Not Work",
    },
    ...times(props.optLen, (index) => ({
      value: index + 1,
      text: index + 1,
    })),
  ]
})
</script>

<style scoped></style>
