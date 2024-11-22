<template>
  <v-card>
    <v-card-title> Details </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="tripType"
            label="Trip Type"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          ></v-text-field>
        </v-col>
      </v-row>

      <component
        :is="tripTypeComponent"
        v-if="tripTypeComponent"
        :travel-authorization-id="travelAuthorizationId"
      />
      <div v-else>Trip type {{ tripType }} not implemented!</div>
      <v-row>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelAuthorization.travelDuration"
            label="# Days"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelAuthorization.daysOffTravelStatus"
            label="Days on non-travel status"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelAuthorization.dateBackToWork"
            label="Expected Date return to work"
            prepend-icon="mdi-calendar"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from "vue"

import useTravelAuthorization from "@/use/use-travel-authorization"

const TRIP_TYPES = Object.freeze({
  ROUND_TRIP: "Round Trip",
  ONE_WAY: "One Way",
  MULTI_DESTINATION: "Multi-Destination",
})

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const tripType = ref(null)

const tripTypeComponent = computed(() => {
  switch (tripType.value) {
    case TRIP_TYPES.ROUND_TRIP:
      return () =>
        import("@/components/travel-authorizations/details-card/RoundTripStopsSection.vue")
    case TRIP_TYPES.ONE_WAY:
      return () => import("@/components/travel-authorizations/details-card/OneWayStopsSection.vue")
    case TRIP_TYPES.MULTI_DESTINATION:
      return () =>
        import("@/components/travel-authorizations/details-card/MultiDestinationStopsSection.vue")
    default:
      return null
  }
})

onMounted(async () => {
  if (travelAuthorization.value.oneWayTrip) {
    tripType.value = TRIP_TYPES.ONE_WAY
  } else if (travelAuthorization.value.multiStop) {
    tripType.value = TRIP_TYPES.MULTI_DESTINATION
  } else {
    tripType.value = TRIP_TYPES.ROUND_TRIP
  }
})
</script>
