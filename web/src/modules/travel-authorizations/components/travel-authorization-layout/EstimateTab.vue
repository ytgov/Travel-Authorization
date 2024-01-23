<template>
  <v-tab
    :to="{
      name: 'EditTravelAuthorizationEstimatePage',
      params: { travelAuthorizationId },
    }"
    >Estimate</v-tab
  >
</template>

<script setup>
defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
