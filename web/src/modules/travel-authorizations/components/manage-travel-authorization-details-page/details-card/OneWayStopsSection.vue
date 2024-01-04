<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :value="originStop.locationId"
          label="From"
          dense
          outlined
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :value="destinationStop.locationId"
          label="To"
          dense
          outlined
          persistent-hint
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
          label="Time (24h)"
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
import { mapGetters } from "vuex"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField"

export default {
  name: "OneWayStopsSection",
  components: {
    VReadonlyLocationTextField,
  },
  data() {
    return {
      originStop: {},
      destinationStop: {},
    }
  },
  computed: {
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      travelAuthorizationId: "id",
    }),
  },
  async mounted() {
    this.originStop = this.travelAuthorization.stops[0]
    this.destinationStop = this.travelAuthorization.stops[1]
  },
  methods: {},
}
</script>
