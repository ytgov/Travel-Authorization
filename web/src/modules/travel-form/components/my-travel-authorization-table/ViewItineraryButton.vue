<template>
  <v-btn
    color="primary"
    @click.stop="viewItinerary"
  >
    View Itinerary
  </v-btn>
</template>

<script>
export default {
  name: "ViewItineraryButton",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    viewItinerary() {
      alert("TODO: view itinerary for travel authorization " + this.travelAuthorizationId)
    },
  },
}
</script>
