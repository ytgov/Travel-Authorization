<template>
  <div>
    <v-row dense>
      <v-col
        cols="12"
        md="2"
      >
        <!-- Depending on in territory flag we will load a different list of destinations -->
        <v-checkbox
          :value="currentForm.allTravelWithinTerritory"
          label="In Territory?"
          dense
          outlined
          readonly
        >
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="purposeText"
          label="Purpose"
          dense
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="finalDestinationText"
          label="Final Destination"
          dense
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="initialDestination.departureDate"
          label="Start Date"
          prepend-icon="mdi-calendar"
          dense
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="finalDestination.departureDate"
          label="End Date"
          prepend-icon="mdi-calendar"
          dense
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { first, last } from "lodash"
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  name: "SummaryHeaderReadonly",
  data: () => ({
    loadingPurposes: false,
    loadingDestinations: false,
  }),
  computed: {
    ...mapState("travelForm", ["currentForm", "purposes"]),
    ...mapGetters("travelForm", ["destinationsByCurrentFormTravelRestriction"]),
    finalDestination() {
      return last(this.currentForm.stops) || {}
    },
    initialDestination() {
      return first(this.currentForm.stops) || {}
    },
    purposeText() {
      const purpose = this.purposes.find((p) => p.id === this.currentForm.purposeId)
      return purpose?.purpose || ""
    },
    finalDestinationText() {
      const destination = this.destinationsByCurrentFormTravelRestriction.find(
        (d) => d.value === this.finalDestination.locationId
      )
      return destination?.text || ""
    },
  },
  async mounted() {
    this.loadingPurposes = true
    this.loadingDestinations = true
    await Promise.all([
      this.loadPurposes().finally(() => {
        this.loadingPurposes = false
      }),
      this.loadDestinations().finally(() => {
        this.loadingDestinations = false
      }),
    ])
  },
  methods: {
    ...mapActions("travelForm", ["loadPurposes", "loadDestinations"]),
  },
}
</script>
