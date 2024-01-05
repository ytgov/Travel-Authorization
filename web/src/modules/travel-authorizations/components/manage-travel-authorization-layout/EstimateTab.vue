<template>
  <v-tab
    :to="{
      name: 'ManageTravelAuthorizationEstimatePage',
      params: { travelAuthorizationId },
    }"
    >Estimate</v-tab
  >
</template>

<script>
export default {
  name: "EstimateTab",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
}
</script>
