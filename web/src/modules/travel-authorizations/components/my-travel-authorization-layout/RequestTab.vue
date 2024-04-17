<template>
  <v-tab
    :to="{
      name: 'MyTravelRequestsRequestEditPage',
      params: { travelAuthorizationId },
    }"
  >
    Request
  </v-tab>
</template>

<script setup>
defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
