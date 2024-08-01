<template>
  <v-btn
    class="ma-0"
    color="secondary"
    :to="{
      name: 'my-travel-requests/request/RequestOptionsProvidedPage',
      params: { travelAuthorizationId },
    }"
    @click.stop
  >
    Rank Travel Desk Options
  </v-btn>
</template>

<script setup>
defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
