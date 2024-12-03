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
import travelDeskFlightSegmentsApi from "@/api/travel-desk-flight-segments-api"

const emit = defineEmits(["imported"])

const rawTravelPortalText = ref("")

const isLoading = ref(false)
const snack = useSnack()

async function parseRawTravelPortalText() {
  isLoading.value = true
  if (!rawTravelPortalText.value) return
  const parsedTravel = parseTravel(rawTravelPortalText.value)

  if (isNil(parsedTravel)) {
    snack.error("Failed to parse travel text")
    return
  }

  const { flights: travelDeskFlightSegmentsAttributes } = parsedTravel
  if (isEmpty(travelDeskFlightSegmentsAttributes)) {
    snack.error("Failed to parse travel text")
    return
  }

  try {
    for (const travelDeskFlightSegmentAttributes of travelDeskFlightSegmentsAttributes) {
      await travelDeskFlightSegmentsApi.create(travelDeskFlightSegmentAttributes)
    }
    emit("imported")
  } catch (error) {
    snack.error("Failed to import flight segments")
  } finally {
    isLoading.value = false
  }
}
</script>
