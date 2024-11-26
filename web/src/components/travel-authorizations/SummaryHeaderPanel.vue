<template>
  <div>
    <v-row dense>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="purposeText"
          :loading="isLoadingTravelPurposes"
          label="Purpose"
          dense
          outlined
          readonly
          append-icon="mdi-lock"
          background-color="white"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :value="finalDestination.locationId"
          label="Final Destination"
          dense
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="initialDestination.departureDate"
          label="Start Date"
          dense
          outlined
          readonly
          append-icon="mdi-lock"
          background-color="white"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="finalDestinationDepartureDate"
          label="End Date"
          dense
          outlined
          readonly
          append-icon="mdi-lock"
          background-color="white"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue"

import { MAX_PER_PAGE } from "@/api/base-api"
import useTravelPurposes from "@/use/use-travel-purposes"
import { useTravelAuthorization } from "@/use/use-travel-authorization"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const {
  travelAuthorization,
  stops,
  firstStop: initialDestination,
  lastStop: finalDestination,
  refresh,
} = useTravelAuthorization(travelAuthorizationId)

const travelPurposesQuery = computed(() => {
  return {
    perPage: MAX_PER_PAGE,
  }
})
const { travelPurposes, isLoading: isLoadingTravelPurposes } =
  useTravelPurposes(travelPurposesQuery)

const purposeText = computed(() => {
  const purpose = travelPurposes.value.find((p) => p.id === travelAuthorization.value.purposeId)
  return purpose?.purpose || ""
})

const finalDestinationDepartureDate = computed(() => {
  if (travelAuthorization.value.multiStop) {
    return stops.value[stops.value.length - 2].departureDate
  }

  return finalDestination.value.departureDate
})

defineExpose({
  refresh,
})
</script>
