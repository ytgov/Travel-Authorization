<template>
  <v-container>
    <TravelDeskTravelRequestCreateCard :travel-authorization-id="travelAuthorizationId" />
  </v-container>
</template>

<script setup>
import TravelDeskTravelRequestCreateCard from "@/components/travel-desk-travel-requests/TravelDeskTravelRequestCreateCard.vue"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
