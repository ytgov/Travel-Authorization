<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :value="stop1.locationId"
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
          :value="stop2.locationId"
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
          :value="stop1.departureDate"
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
          :value="stop1.departureTime"
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
          :value="stop1.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
        />
        <v-text-field
          :value="stop1.accommodationType"
          label="Type of Accommodation"
          dense
          outlined
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :value="stop2.locationId"
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
        <VReadonlyLocationTextField
          :value="stop3.locationId"
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
        <v-text-field
          :value="stop2.departureDate"
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
          :value="stop2.departureTime"
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
          :value="stop2.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
        />
        <v-text-field
          :value="stop2.accommodationType"
          label="Type of Accommodation"
          dense
          outlined
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <VReadonlyLocationTextField
          :value="stop3.locationId"
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
          :value="stop4.locationId"
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
          :value="stop3.departureDate"
          text="Date"
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
          :value="stop3.departureTime"
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
          :value="stop3.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
        />
        <v-text-field
          :value="stop3.accommodationType"
          label="Type of Accommodation"
          dense
          outlined
          readonly
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField"

export default {
  name: "MultiDestinationStopsSection",
  components: {
    VReadonlyLocationTextField,
  },
  data() {
    return {
      stop1: {},
      stop2: {},
      stop3: {},
      stop4: {},
    }
  },
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization"]),
    ...mapGetters("travelAuthorizations", ["currentTravelAuthorizationId"]),
  },
  async mounted() {
    this.stop1 = this.currentTravelAuthorization.stops[0]
    this.stop2 = this.currentTravelAuthorization.stops[1]
    this.stop3 = this.currentTravelAuthorization.stops[2]
    this.stop4 = this.currentTravelAuthorization.stops[3]
  },
  methods: {},
}
</script>
