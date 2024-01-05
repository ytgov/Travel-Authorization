<template>
  <v-tab
    :to="{
      name: 'ManageTravelAuthorizationDetailsPage',
      params: { travelAuthorizationId },
    }"
  >
    Details
  </v-tab>
</template>

<script>
export default {
  name: "DetailsTab",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
}
</script>
