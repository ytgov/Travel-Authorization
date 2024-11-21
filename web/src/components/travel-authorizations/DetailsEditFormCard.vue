<template>
  <v-card>
    <v-card-title> Details </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              :value="tripType"
              :items="tripTypes"
              :rules="[required]"
              label="Trip Type"
              dense
              outlined
              required
              @change="updateTripType"
            ></v-select>
          </v-col>
        </v-row>

        <component
          :is="tripTypeComponent"
          v-if="tripTypeComponent && hasEnoughStops"
          :value="stops"
          :all-travel-within-territory="travelAuthorization.allTravelWithinTerritory"
          @input="replaceStops"
        />
        <div v-else>Trip type {{ tripType }} not implemented!</div>
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <TravelDurationTextField
              v-model="travelAuthorization.travelDuration"
              :stops="travelAuthorization.stops"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-text-field
              v-model="travelAuthorization.daysOffTravelStatus"
              :rules="[isInteger]"
              label="Days on non-travel status"
              dense
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <DatePicker
              v-model="travelAuthorization.dateBackToWork"
              :min="lastStop.departureDate"
              :rules="[required]"
              label="Expected Date return to work"
              dense
              required
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, toRefs } from "vue"
import { pick } from "lodash"

import { ACCOMMODATION_TYPES, TRAVEL_METHODS } from "@/api/stops-api"
import { required, isInteger } from "@/utils/validators"

import useTravelAuthorization from "@/use/use-travel-authorization"

import DatePicker from "@/components/common/DatePicker.vue"
import TravelDurationTextField from "@/components/travel-authorizations/details-edit-form-card/TravelDurationTextField.vue"

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
const { travelAuthorization, stops, firstStop, lastStop, save, newBlankStop, replaceStops } =
  useTravelAuthorization(travelAuthorizationId)

const tripTypes = computed(() => Object.values(TRIP_TYPES))
const tripType = ref(null)

const tripTypeComponent = computed(() => {
  switch (tripType.value) {
    case TRIP_TYPES.ROUND_TRIP:
      return () =>
        import(
          "@/components/travel-authorizations/details-edit-form-card/RoundTripStopsSection.vue"
        )
    case TRIP_TYPES.ONE_WAY:
      return () =>
        import("@/components/travel-authorizations/details-edit-form-card/OneWayStopsSection.vue")
    case TRIP_TYPES.MULTI_DESTINATION:
      return () =>
        import(
          "@/components/travel-authorizations/details-edit-form-card/MultiDestinationStopsSection.vue"
        )
    default:
      return null
  }
})

const hasEnoughStops = computed(() => {
  switch (tripType.value) {
    case TRIP_TYPES.ROUND_TRIP:
      return stops.value.length === 2
    case TRIP_TYPES.ONE_WAY:
      return stops.value.length === 2
    case TRIP_TYPES.MULTI_DESTINATION:
      return stops.value.length === 4
    default:
      return true
  }
})

/** @typedef {import('vuetify/lib/components').VForm} VForm */
/** @type {import('vue').Ref<typeof VForm | null>} */
const form = ref(null)

onMounted(async () => {
  if (travelAuthorization.value.oneWayTrip) {
    tripType.value = TRIP_TYPES.ONE_WAY
  } else if (travelAuthorization.value.multiStop) {
    tripType.value = TRIP_TYPES.MULTI_DESTINATION
  } else {
    tripType.value = TRIP_TYPES.ROUND_TRIP
  }

  await nextTick()
  form.value?.resetValidation()
})

async function updateTripType(value) {
  tripType.value = value
  if (value === TRIP_TYPES.ROUND_TRIP) {
    travelAuthorization.value.oneWayTrip = false
    travelAuthorization.value.multiStop = false
  } else if (value === TRIP_TYPES.ONE_WAY) {
    travelAuthorization.value.oneWayTrip = true
    travelAuthorization.value.multiStop = false
  } else if (value === TRIP_TYPES.MULTI_DESTINATION) {
    travelAuthorization.value.multiStop = true
    travelAuthorization.value.oneWayTrip = false
  } else {
    throw new Error("Invalid trip type")
  }

  await ensureMinimalDefaultStops(tripType.value)

  await nextTick()
  form.value?.resetValidation()
}

async function ensureMinimalDefaultStops(tripType) {
  if (tripType === TRIP_TYPES.ROUND_TRIP) {
    return ensureMinimalDefaultRoundTripStops()
  } else if (tripType === TRIP_TYPES.ONE_WAY) {
    return ensureMinimalDefaultOneWayStops()
  } else if (tripType === TRIP_TYPES.MULTI_DESTINATION) {
    return ensureMinimalDefaultMultiDestinationStops()
  } else {
    throw new Error("Invalid trip type")
  }
}

async function ensureMinimalDefaultRoundTripStops() {
  const newFirstStop = await newBlankStop({
    transport: TRAVEL_METHODS.AIRCRAFT,
    ...firstStop.value,
    accommodationType: firstStop.value.accommodationType || ACCOMMODATION_TYPES.HOTEL,
  })
  const newLastStop = await newBlankStop({
    ...lastStop.value,
    transport: TRAVEL_METHODS.AIRCRAFT,
    accommodationType: null,
  })
  return replaceStops([newFirstStop, newLastStop])
}

async function ensureMinimalDefaultOneWayStops() {
  const newFirstStop = await newBlankStop({
    ...firstStop.value,
    accommodationType: null,
    transport: TRAVEL_METHODS.AIRCRAFT,
  })
  const newLastStop = await newBlankStop({
    ...lastStop.value,
    transport: null,
    accommodationType: null,
  })
  return replaceStops([newFirstStop, newLastStop])
}

async function ensureMinimalDefaultMultiDestinationStops() {
  const newFirstStop = await newBlankStop({
    transport: TRAVEL_METHODS.AIRCRAFT,
    ...firstStop.value,
    accommodationType: firstStop.value.accommodationType || ACCOMMODATION_TYPES.HOTEL,
  })
  const secondStop = stops.value[1] !== lastStop.value ? stops.value[1] : {}
  const newSecondStop = await newBlankStop({
    accommodationType: ACCOMMODATION_TYPES.HOTEL,
    transport: TRAVEL_METHODS.AIRCRAFT,
    ...secondStop,
  })
  const newThirdStop = await newBlankStop({
    ...pick(lastStop.value, "departureDate", "departureTime"),
    accommodationType: null,
    transport: TRAVEL_METHODS.AIRCRAFT,
  })
  const newLastStop = await newBlankStop({
    ...pick(lastStop.value, "locationId"),
    transport: null,
    accommodationType: null,
  })
  return replaceStops([newFirstStop, newSecondStop, newThirdStop, newLastStop])
}

defineExpose({
  save,
  validate: () => form.value?.validate(),
})
</script>
