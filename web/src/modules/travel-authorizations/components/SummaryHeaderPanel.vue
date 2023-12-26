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
        <VReadonlyLocationTextField
          :value="finalDestination.locationId"
          label="Final Destination"
          dense
          outlined
        />
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
          :value="finalDestinationDepartureDate"
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
import { mapActions, mapGetters } from "vuex"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField"

export default {
  name: "SummaryHeaderPanel",
  components: {
    VReadonlyLocationTextField,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      stops: "stops",
      initialDestination: "firstStop",
      finalDestination: "lastStop",
    }),
    ...mapGetters("travelPurposes", {
      travelPurposes: "items",
      isLoadingTravelPurposes: "isLoading",
    }),
    purposeText() {
      const purpose = this.travelPurposes.find((p) => p.id === this.travelAuthorization.purposeId)
      return purpose?.purpose || ""
    },
    finalDestinationDepartureDate() {
      if (this.travelAuthorization.multiStop) {
        return this.stops[this.stops.length - 2].departureDate
      }

      return this.finalDestination.departureDate
    },
  },
  async mounted() {
    await Promise.all([
      this.ensureTravelPurposes(),
      this.ensureTravelAuthorization(this.travelAuthorizationId),
    ])
  },
  methods: {
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
    ...mapActions("travelPurposes", { ensureTravelPurposes: "ensure" }),
  },
}
</script>
