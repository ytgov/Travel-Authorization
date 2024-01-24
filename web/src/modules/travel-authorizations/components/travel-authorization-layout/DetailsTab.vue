<template>
  <v-tab
    :to="{
      name: 'EditTravelAuthorizationDetailsPage',
      params: { travelAuthorizationId },
    }"
  >
    Details
  </v-tab>
</template>

<script setup>
defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

// TODO: make link dynamic and also show read-only view?
</script>
