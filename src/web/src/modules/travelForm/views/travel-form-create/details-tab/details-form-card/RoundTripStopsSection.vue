<template>
  <div>
    <div
      v-for="(stop, index) in stops"
      :key="`stop-${index}`"
    >
      <v-autocomplete
        v-model="stop.locationId"
        :items="destinations"
        :rules="[required]"
        label="From"
        background-color="white"
        dense
        persistent-hint
        required
        clearable
        outlined
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "RoundTripStopsSection",
  data: () => ({
    stops: [{}, {}],
    required: (v) => !!v || "This field is required",
  }),
  computed: {
    ...mapState("travelForm", ["destinations"]),
  },
  async mounted() {
    await this.loadDestinations()
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
  },
}
</script>
