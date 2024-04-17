<template>
  <v-container>
    <NewTravelDeskRequest
      type="Submit"
      :authorized-travel="{
        id: travelAuthorizationId,
      }"
    />
  </v-container>
</template>

<script setup>
import NewTravelDeskRequest from "@/modules/travelDesk/views/Requests/NewTravelDeskRequest.vue"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
