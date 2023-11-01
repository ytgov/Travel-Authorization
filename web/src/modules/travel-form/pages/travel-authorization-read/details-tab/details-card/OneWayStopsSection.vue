<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="getDestinationText(originStop.locationId)"
          label="From"
          dense
          outlined
          persistent-hint
          readonly
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="getDestinationText(destinationStop.locationId)"
          label="To"
          dense
          outlined
          persistent-hint
          readonly
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="originStop.departureDate"
          label="Date"
          prepend-icon="mdi-calendar"
          dense
          outlined
          persistent-hint
          readonly
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="originStop.departureTime"
          label="Time"
          prepend-icon="mdi-clock"
          dense
          outlined
          persistent-hint
          readonly
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          :value="originStop.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
        />
        <v-text-field
          :value="originStop.accommodationType"
          label="Type of Accommodation"
          dense
          persistent-hint
          outlined
          readonly
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"

export default {
  name: "OneWayStopsSection",
  components: {},
  data() {
    return {
      originStop: {},
      destinationStop: {},
    }
  },
  computed: {
    ...mapState("travelForm", ["currentForm"]),
    ...mapGetters("travelForm", ["currentFormId", "destinationsByCurrentFormTravelRestriction"]),
  },
  async mounted() {
    await this.loadDestinations()

    this.originStop = this.currentForm.stops[0]
    this.destinationStop = this.currentForm.stops[1]
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    getDestinationText(locationId) {
      const destination = this.destinationsByCurrentFormTravelRestriction.find(
        (d) => d.value === locationId
      )
      return destination?.text || ""
    },
  },
}
</script>
