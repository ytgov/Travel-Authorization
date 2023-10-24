<template>
  <v-btn
    class="ma-0"
    color="secondary"
    @click.stop="submitTravelDeskRequest"
  >
    Submit Travel Desk Request
  </v-btn>
</template>

<script>
export default {
  name: "SubmitTravelDeskRequestButton",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    submitTravelDeskRequest() {
      alert(
        "TODO: submit travel desk request for travel authorization " + this.travelAuthorizationId
      )
    },
  },
}
</script>
