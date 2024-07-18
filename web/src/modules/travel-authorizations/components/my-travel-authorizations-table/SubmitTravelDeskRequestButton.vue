<template>
  <v-btn
    class="ma-0"
    color="secondary"
    :to="{
      name: 'my-travel-requests/request/RequestEditPage',
      params: { travelAuthorizationId },
    }"
    @click.stop
  >
    Submit Travel Desk Request
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
