<template>
  <v-card>
    <v-card-title> Purpose </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-row dense>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                :value="purposeText"
                :loading="isLoadingTravelPurposes"
                label="Purpose"
                dense
                outlined
                readonly
                append-icon="mdi-lock"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :value="travelAuthorization.eventName"
                label="Name of meeting/conference, mission, trade fair or course"
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
              <!-- Depending on in territory flag we will load a different list of destinations -->
              <v-checkbox
                :value="travelAuthorization.allTravelWithinTerritory"
                label="In Territory?"
                dense
                readonly
                append-icon="mdi-lock"
              >
              </v-checkbox>
            </v-col>
            <v-col
              cols="12"
              md="9"
            >
              <LocationReadonlyTextField
                :location-id="finalDestination.locationId"
                label="Final Destination"
                dense
                outlined
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <h3>Objectives</h3>
              <ul>
                <li>Purpose of attendance</li>
                <li>Relevance and anticipated benefits to branch and Government of Yukon</li>
              </ul>
            </v-col>
            <v-col
              cols="12"
              md="9"
            >
              <v-textarea
                :value="travelAuthorization.benefits"
                label="Objectives"
                rows="10"
                auto-grow
                dense
                outlined
                readonly
                append-icon="mdi-lock"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, toRefs } from "vue"
import { last } from "lodash"

import { MAX_PER_PAGE } from "@/api/base-api"
import useTravelAuthorization from "@/use/use-travel-authorization"
import useTravelPurposes from "@/use/use-travel-purposes"

import LocationReadonlyTextField from "@/components/locations/LocationReadonlyTextField.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const travelPurposesQuery = computed(() => {
  return {
    perPage: MAX_PER_PAGE,
  }
})
const { travelPurposes, isLoading: isLoadingTravelPurposes } =
  useTravelPurposes(travelPurposesQuery)

const finalDestination = computed(() => {
  return (
    last(travelAuthorization.value.stops) || {
      travelAuthorizationId: travelAuthorizationId.value,
    }
  )
})

const purposeText = computed(() => {
  const purpose = travelPurposes.value.find((p) => p.id === travelAuthorization.value.purposeId)
  return purpose?.purpose || ""
})
</script>
