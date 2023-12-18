<template>
  <v-btn
    class="ma-0"
    color="error"
    @click.stop="deleteTravelAuthorization"
  >
    Delete
  </v-btn>
</template>

<script>
export default {
  name: "DeleteTravelAuthorizationDialog",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    deleteTravelAuthorization() {
      alert("TODO: delete travel authorization " + this.travelAuthorizationId)
    },
  },
}
</script>
