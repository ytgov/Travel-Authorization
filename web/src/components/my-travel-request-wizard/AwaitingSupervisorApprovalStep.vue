<template>
  <v-card>
    <v-card-title>
      <h2>Awaiting Approval</h2>
    </v-card-title>

    <v-card-text>
      <p>You have submitted a travel request and it is awaiting approval from your supervisor.</p>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

async function initialize(context) {
  context.setEditableSteps(["review-trip-details", "review-submitted-estimate"])
}

defineExpose({
  initialize,
})
</script>
