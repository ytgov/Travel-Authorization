<template>
  <v-container>
    <TravelDeskTravelRequestCreateFormCard
      type="Submit"
      :authorized-travel="{
        id: travelAuthorizationId,
      }"
    />
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
