<template>
  <v-container>
    <TravelDeskTravelRequestCreateFormCard :travel-authorization-id="travelAuthorizationId" />
  </v-container>
</template>

<script setup>
import TravelDeskTravelRequestCreateFormCard from "@/components/travel-desk-travel-requests/TravelDeskTravelRequestCreateFormCard.vue"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
