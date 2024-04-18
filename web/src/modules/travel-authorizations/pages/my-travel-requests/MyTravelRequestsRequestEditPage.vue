<template>
  <v-container>
    <TravelDeskTravelRequestEditCard :travel-authorization-id="travelAuthorizationId" />
  </v-container>
</template>

<script setup>
import TravelDeskTravelRequestEditCard from "@/components/travel-desk-travel-requests/TravelDeskTravelRequestEditCard.vue"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
