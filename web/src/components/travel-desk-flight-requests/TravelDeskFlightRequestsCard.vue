<template>
  <v-card>
    <v-card-title>
      <h4>Flight Requests</h4>
    </v-card-title>
    <v-card-text>
      <TravelDeskFlightRequestsDataTable
        :where="{
          travelRequestId: travelDeskTravelRequestId,
        }"
        route-query-suffix="TravelDeskFlightRequest"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import TravelDeskFlightRequestsDataTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsDataTable.vue"

defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})
</script>
