<template>
  <v-btn
    class="ma-0"
    color="secondary"
    :to="{
      name: 'EditMyTravelAuthorizationExpensePage',
      params: { travelAuthorizationId },
    }"
    @click.stop
  >
    Submit Expense Claim
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
