<template>
  <v-btn
    class="ma-0"
    color="secondary"
    @click.stop="submitPoolVehicleRequest"
  >
    Submit Pool Vehicle Request
  </v-btn>
</template>

<script>
export default {
  name: "SubmitPoolVehicleRequestButton",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    submitPoolVehicleRequest() {
      alert(
        "TODO: submit pool vehicle request for travel authorization " + this.travelAuthorizationId
      )
    },
  },
}
</script>
