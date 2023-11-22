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
    ...mapGetters("current/travelAuthorization", { currentTravelAuthorization: "attributes" }),
    ...mapGetters("current/travelAuthorization/stops", {
      currentTravelAuthorizationStops: "items",
      initialDestination: "firstStop",
      finalDestination: "lastStop",
    }),
    ...mapGetters("travelPurposes", {
      travelPurposes: "items",
      isLoadingTravelPurposes: "isLoading",
    }),
    purposeText() {
      const purpose = this.travelPurposes.find(
        (p) => p.id === this.currentTravelAuthorization.purposeId
      )
      return purpose?.purpose || ""
    },
  },
  async mounted() {
    await this.ensureCurrentTravelAuthorization(this.travelAuthorizationId)
    await this.ensureCurrentTravelAuthorizationStops(this.travelAuthorizationId)
    await this.ensureTravelPurposes()
  },
  methods: {
    ...mapActions("current/travelAuthorization", { ensureCurrentTravelAuthorization: "ensure" }),
    ...mapActions("current/travelAuthorization/stops", {
      ensureCurrentTravelAuthorizationStops: "ensure",
    }),
    ...mapActions("travelPurposes", { ensureTravelPurposes: "ensure" }),
  },
}
</script>
