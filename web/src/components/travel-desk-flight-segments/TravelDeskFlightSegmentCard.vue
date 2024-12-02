<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="card"
  />
  <v-card
    v-else
    outlined
  >
    <v-card-title class="blue--text font-weight-bold">
      Flight: {{ travelDeskFlightSegment.flightNumber }}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row class="easy-reading-text">
        <v-col
          cols="12"
          md="6"
        >
          <strong>From:</strong> {{ departLocation }}
          <br />
          Terminal: {{ departTerminal }}
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <strong>Departure:</strong>
          {{ formatDate(travelDeskFlightSegment.departAt, "HH:mm dd MMM yyyy") }}
        </v-col>
      </v-row>
      <v-row class="easy-reading-text">
        <v-col
          cols="12"
          md="6"
        >
          <strong>To:</strong> {{ arriveLocation }}
          <br />
          Terminal: {{ arriveTerminal }}
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <strong>Arrival:</strong>
          {{ formatDate(travelDeskFlightSegment.arriveAt, "HH:mm dd MMM yyyy") }}
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <strong>Class:</strong> {{ travelDeskFlightSegment.class }}
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <strong>Baggage:</strong> {{ travelDeskFlightSegment.baggage }}
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <strong>Duration:</strong> {{ travelDeskFlightSegment.duration }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, toRefs } from "vue"

import formatDate from "@/utils/format-date"

import useTravelDeskFlightSegment from "@/use/use-travel-desk-flight-segment"

const props = defineProps({
  travelDeskFlightSegmentId: {
    type: Number,
    required: true,
  },
})

const { travelDeskFlightSegmentId } = toRefs(props)
const { travelDeskFlightSegment, isLoading } = useTravelDeskFlightSegment(travelDeskFlightSegmentId)

// TODO: maybe add "terminal" to data model?
const BEFORE_TERMINAL_REGEX = /(.*)\s+Terminal:/i
const AFTER_TERMINAL_REGEX = /Terminal:\s*(.*)/i

const departLocation = computed(() => {
  const match = travelDeskFlightSegment.value.departLocation.match(BEFORE_TERMINAL_REGEX)
  if (!match) return travelDeskFlightSegment.value.departLocation

  return match[1]
})

const arriveLocation = computed(() => {
  const match = travelDeskFlightSegment.value.arriveLocation.match(BEFORE_TERMINAL_REGEX)
  if (!match) return travelDeskFlightSegment.value.arriveLocation

  return match[1]
})

const departTerminal = computed(() => {
  const match = travelDeskFlightSegment.value.departLocation.match(AFTER_TERMINAL_REGEX)
  if (!match) return ""

  return match[1]
})

const arriveTerminal = computed(() => {
  const match = travelDeskFlightSegment.value.arriveLocation.match(AFTER_TERMINAL_REGEX)
  if (!match) return ""

  return match[1]
})
</script>

<style scoped>
.easy-reading-text {
  font-size: 1.2em;
  line-height: 1.5;
}
</style>
