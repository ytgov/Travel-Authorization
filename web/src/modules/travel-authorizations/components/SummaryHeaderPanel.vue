<template>
  <div>
    <v-row dense>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          :value="purposeText"
          :loading="isLoadingTravelPurposes"
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
  name: "SummaryHeaderPanel",
  data: () => ({
    loadingDestinations: false,
  }),
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization", "purposes"]),
    ...mapState("travelPurposes", {
      travelPurposes: "items",
      isLoadingTravelPurposes: "isLoading",
    }),
    ...mapGetters("travelAuthorizations", ["destinationsByCurrentFormTravelRestriction"]),
    finalDestination() {
      return last(this.currentTravelAuthorization.stops) || {}
    },
    initialDestination() {
      return first(this.currentTravelAuthorization.stops) || {}
    },
    purposeText() {
      const purpose = this.travelPurposes.find(
        (p) => p.id === this.currentTravelAuthorization.purposeId
      )
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
    await this.ensureTravelPurposes()

    this.loadingDestinations = true
    await this.loadDestinations().finally(() => {
      this.loadingDestinations = false
    })
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadDestinations"]),
    ...mapActions("travelPurposes", { ensureTravelPurposes: "ensure" }),
  },
}
</script>
