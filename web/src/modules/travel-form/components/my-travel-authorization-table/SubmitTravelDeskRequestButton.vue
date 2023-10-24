<template>
  <v-btn
    color="primary"
    @click.stop="submitTravelDeskRequest"
  >
    Submit Travel Desk Request
  </v-btn>
</template>

<script>
export default {
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    submitTravelDeskRequest() {
      alert("TODO: submit travel desk request for travel authorization " + this.travelAuthorizationId);
    },
  },
}
</script>
