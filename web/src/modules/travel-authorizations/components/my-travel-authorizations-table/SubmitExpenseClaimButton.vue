<template>
  <v-btn
    class="ma-0"
    color="secondary"
    :to="{
      name: 'my-travel-requests/MyTravelRequestWizardPage',
      params: {
        travelAuthorizationId,
        stepName: 'submit-expenses',
      },
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
