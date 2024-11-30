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
          <v-select
            label="Cost ($)"
            :value="flightOption.cost"
            readonly
          />
        </v-col>
      </v-row>
      <pre>{{ travelDeskFlightSegments }}</pre>
      <v-row
        v-for="(flightSegment, inx) in travelDeskFlightSegments"
        :key="'segment-' + flightSegment.id + '-' + inx"
      >
        <table style="width: 100%; margin-top: 1rem">
          <tbody>
            <tr style="line-height: 1rem">
              <td colspan="3">{{ flightSegment.flightNumber }}</td>
            </tr>
            <tr style="background: #f9f9f9">
              <td style="width: 16%">Departure:</td>
              <td style="width: 30%">{{ flightSegment.departAt | beautifyDateTime }}</td>
              <td style="width: 50%">{{ flightSegment.departLocation }}</td>
            </tr>
            <tr style="line-height: 1rem">
              <td style="width: 16%">Arrival:</td>
              <td style="width: 30%">{{ flightSegment.arriveAt | beautifyDateTime }}</td>
              <td style="width: 50%">{{ flightSegment.arriveLocation }}</td>
            </tr>
            <tr style="background: #f9f9f9">
              <td style="width: 16%">Duration</td>
              <td style="width: 30%">
                {{ flightSegment.duration }}
              </td>
              <td style="width: 50%"></td>
            </tr>
          </tbody>
        </table>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { times } from "lodash"

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

console.log(`travelDeskFlightSegments:`, travelDeskFlightSegments)

const DOES_NOT_WORK = -1

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

<style scoped>
::v-deep .v-text-field.v-text-field .v-input__control {
  min-height: 5px;
}
</style>
