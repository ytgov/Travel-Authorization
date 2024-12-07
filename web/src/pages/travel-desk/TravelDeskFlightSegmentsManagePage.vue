<template>
  <v-container class="mx-0 mx-md-auto px-0 px-md-4">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <h2>Manage Groups/Flight Options</h2>
        <v-btn
          :to="{
            name: 'TravelDeskEditPage',
            params: {
              travelDeskTravelRequestId,
            },
          }"
          color="secondary"
        >
          Back
        </v-btn>
      </v-card-title>
      <v-card-text class="px-0 px-md-4">
        <v-row class="mt-5">
          <v-col>
            <TravelDeskFlightSegmentsImporterCard @imported="appendFlightSegmentsAttributes" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="mt-5">
              <v-card-title><h3>Cost and Group Segments</h3></v-card-title>
              <v-card-text class="px-0 px-md-4">
                <TravelDeskFlightSegmentsWorkspaceCard
                  v-model="travelDeskFlightSegmentsAttributes"
                  :travel-desk-travel-request-id="travelDeskTravelRequestIdAsNumber"
                  @createdFlightOption="refreshFlightOptionsWorkspaceCard"
                />
                <TravelDeskFlightOptionsWorkspaceCard
                  ref="travelDeskFlightOptionsWorkspaceCard"
                  class="mt-5"
                  :travel-desk-travel-request-id="travelDeskTravelRequestIdAsNumber"
                />
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :to="{
                      name: 'TravelDeskEditPage',
                      params: {
                        travelDeskTravelRequestId,
                      },
                    }"
                    color="primary"
                  >
                    Return to Travel Request
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, ref } from "vue"

import useSessionStorage from "@/use/utils/use-session-storage"
import useBreadcrumbs from "@/use/use-breadcrumbs"

import TravelDeskFlightSegmentsImporterCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsImporterCard.vue"
import TravelDeskFlightSegmentsWorkspaceCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsWorkspaceCard.vue"
import TravelDeskFlightOptionsWorkspaceCard from "@/components/travel-desk-flight-options/TravelDeskFlightOptionsWorkspaceCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: [String, Number],
    required: true,
  },
})

const travelDeskTravelRequestIdAsNumber = computed(() => parseInt(props.travelDeskTravelRequestId))

const travelDeskFlightSegmentsAttributes = useSessionStorage(
  `travel-desk-travel-request-${props.travelDeskTravelRequestId}-travel-desk-flight-segments-attributes`,
  []
)

function appendFlightSegmentsAttributes(newFlightSegmentsAttributes) {
  travelDeskFlightSegmentsAttributes.value = [
    ...travelDeskFlightSegmentsAttributes.value,
    ...newFlightSegmentsAttributes,
  ]
}

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskFlightOptionsWorkspaceCard> | null>} */
const travelDeskFlightOptionsWorkspaceCard = ref(null)

function refreshFlightOptionsWorkspaceCard() {
  travelDeskFlightOptionsWorkspaceCard.value.refresh()
}

useBreadcrumbs([
  {
    text: "Travel Desk",
    to: {
      name: "TravelDeskPage",
    },
  },
  {
    text: "Request",
    to: {
      name: "TravelDeskReadPage",
      params: { travelDeskTravelRequestId: props.travelDeskTravelRequestId },
    },
  },
  {
    text: "Edit",
    to: {
      name: "TravelDeskEditPage",
      params: { travelDeskTravelRequestId: props.travelDeskTravelRequestId },
    },
  },
  {
    text: "Manage Flight Segments",
    to: {
      name: "TravelDeskFlightSegmentsManagePage",
      params: { travelDeskTravelRequestId: props.travelDeskTravelRequestId },
    },
  },
])
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
