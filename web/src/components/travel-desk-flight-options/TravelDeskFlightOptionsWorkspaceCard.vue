<template>
  <v-card>
    <v-card-title>
      <h4>Flight Options Groupings</h4>
    </v-card-title>

    <v-data-iterator
      :items="travelDeskFlightOptions"
      :server-items-length="totalCount"
      :items-per-page="-1"
      :loading="isLoading"
      hide-default-footer
    >
      <template #default="{ items }">
        <v-card
          v-for="(item, index) in items"
          :key="`travel-desk-flight-option-${item.id}`"
        >
          <v-card-title>
            <h5>Group {{ index + 1 }}</h5>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <TravelDeskFlightRequestSelect
                  v-model="item.flightRequestId"
                  label="Leg *"
                  :where="{
                    travelRequestId: travelDeskTravelRequestId,
                  }"
                  :rules="[required]"
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="2"
              >
                <v-text-field
                  v-model="item.cost"
                  label="Cost *"
                  type="number"
                  :rules="[required]"
                  prefix="$"
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="item.duration"
                  label="Travel Duration"
                  readonly
                  outlined
                  append-icon="mdi-lock"
                />
              </v-col>
            </v-row>
            <TravelDeskFlightSegmentsDraggable :travel-desk-flight-option-id="item.id" />
          </v-card-text>
        </v-card>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script setup>
import { computed } from "vue"

import { required } from "@/utils/validators"

import useTravelDeskFlightOptions from "@/use/use-travel-desk-flight-options"

import TravelDeskFlightRequestSelect from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestSelect.vue"
import TravelDeskFlightSegmentsDraggable from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsDraggable.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const travelDeskFlightOptionsQuery = computed(() => ({
  filters: {
    forTravelRequest: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskFlightOptions, totalCount, isLoading } = useTravelDeskFlightOptions(
  travelDeskFlightOptionsQuery
)
</script>

<style scoped></style>
