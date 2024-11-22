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
          append-icon="mdi-lock"
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
          append-icon="mdi-lock"
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
          append-icon="mdi-lock"
        />
        <v-text-field
          :value="originStop.accommodationType"
          label="Type of Accommodation"
          dense
          outlined
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
    </v-row>
    <v-row>
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
        <v-text-field
          :value="destinationStop.departureDate"
          label="Date"
          prepend-icon="mdi-calendar"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="destinationStop.departureTime"
          label="Time (24h)"
          prepend-icon="mdi-clock"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          :value="destinationStop.transport"
          label="Travel Method"
          dense
          persistent-hint
          outlined
          readonly
          append-icon="mdi-lock"
        />
        <v-text-field
          :value="destinationStop.accommodationType"
          label="Type of Accommodation"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          dense
          outlined
          persistent-hint
          readonly
          append-icon="mdi-lock"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField"

export default {
  name: "RoundTripStopsSection",
  components: {
    VReadonlyLocationTextField,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
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
    }),
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)

    this.originStop = this.travelAuthorization.stops[0]
    this.destinationStop = this.travelAuthorization.stops[1]
  },
  methods: {
    ...mapActions("travelAuthorization", {
      ensureTravelAuthorization: "ensure",
    }),
  },
}
</script>
