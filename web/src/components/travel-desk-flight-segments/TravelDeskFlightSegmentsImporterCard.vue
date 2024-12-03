<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <h4>Import Flight Segments from Travelport&trade; Text</h4>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-textarea
            v-model="rawTravelPortalText"
            label="Paste Text Here"
            rows="8"
            clearable
            outlined
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="isLoading"
        color="primary"
        @click="parseRawTravelPortalText"
      >
        Import Flight Segments
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from "vue"
import { isEmpty, isNil } from "lodash"

import parseTravel from "@/utils/parse-travel"

import useSnack from "@/use/use-snack"

const emit = defineEmits(["imported"])

const rawTravelPortalText = ref("")

const isLoading = ref(false)
const snack = useSnack()

// TODO: build a simplified travel parser that only returns flight segment information.
// This parser should also clean the data, so it returns it as TravelDeskFlightSegment creation attributes
async function parseRawTravelPortalText() {
  isLoading.value = true
  if (!rawTravelPortalText.value) return
  const parsedTravel = parseTravel(rawTravelPortalText.value)

  if (isNil(parsedTravel)) {
    snack.error("Failed to parse travel text")
    return
  }

  const { flights: rawFlightSegmentsAttributes } = parsedTravel
  if (isEmpty(rawFlightSegmentsAttributes)) {
    snack.error("Failed to parse travel text")
    return
  }

  const travelDeskFlightSegmentsAttributes = []
  for (const rawFlightSegmentAttributes of rawFlightSegmentsAttributes) {
    const travelDeskFlightSegmentAttributes = cleanRawFlightSegmentAttributes(
      rawFlightSegmentAttributes
    )
    travelDeskFlightSegmentsAttributes.push(travelDeskFlightSegmentAttributes)
  }

  try {
    emit("imported", travelDeskFlightSegmentsAttributes)
  } catch (error) {
    snack.error("Failed to import flight segments")
  } finally {
    isLoading.value = false
  }
}

// TODO: validate this legacy code
function cleanRawFlightSegmentAttributes(rawFlightSegmentAttributes) {
  const arrivalDate = getFlightDate(rawFlightSegmentAttributes.arrivalDate)
  const departureDate = getFlightDate(rawFlightSegmentAttributes.departureDate)

  const flightSegmentAttributes = {
    sortOrder: 1,
    flightNumber: cleanText(
      rawFlightSegmentAttributes.airline + " " + rawFlightSegmentAttributes.flightNumber
    ),
    departAt: departureDate,
    departDay: departureDate.toISOString().slice(0, 10),
    departTime: cleanText(rawFlightSegmentAttributes.departureTime),
    departLocation: cleanText(
      rawFlightSegmentAttributes.departureAirport +
        " " +
        rawFlightSegmentAttributes.departureAirportCode +
        " Terminal: " +
        rawFlightSegmentAttributes.departureTerminal
    ),
    arriveAt: arrivalDate,
    arriveDay: arrivalDate.toISOString().slice(0, 10),
    arriveTime: cleanText(rawFlightSegmentAttributes.arrivalTime),
    arriveLocation: cleanText(
      rawFlightSegmentAttributes.arrivalAirport +
        " " +
        rawFlightSegmentAttributes.arrivalAirportCode +
        " Terminal: " +
        rawFlightSegmentAttributes.arrivalTerminal
    ),
    duration: cleanText(rawFlightSegmentAttributes.duration),
    status: cleanText(rawFlightSegmentAttributes.status),
    class: cleanText(rawFlightSegmentAttributes.class),
  }

  return flightSegmentAttributes
}

function cleanText(txt) {
  txt = txt.replace("undefined", "")
  txt = txt.replace(/\s\s+/g, " ")
  txt = txt.trim()
  return txt
}

function getFlightDate(date) {
  const today = new Date()
  const flightDate = this.cleanText(date)
  let fullDate = new Date()

  const datePattern = /^(\d{1,2})(\/|\s|-)([A-Za-z]{2,3})(,?)(\/|\s|-)(\d{2}|\d{4})$/
  const datePatternI = /^(\d{1,2})(\/|\s|-)([A-Za-z]{3})$/
  const datePatternII = /^([A-Za-z]{3})(\/|\s|-)(\d{1,2})$/

  if (flightDate.match(datePattern)) {
    fullDate = new Date(flightDate)
  } else if (flightDate.match(datePatternI) || flightDate.match(datePatternII)) {
    fullDate = new Date(flightDate + " " + today.getFullYear())
    if (fullDate < today) {
      fullDate = new Date(flightDate + " " + (today.getFullYear() + 1))
    }
  }
  return fullDate
}
</script>
