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
import { first, last } from "lodash"
import { mapActions, mapState } from "vuex"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField"

export default {
  name: "SummaryHeaderPanel",
  components: {
    VReadonlyLocationTextField,
  },
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization", "purposes"]),
    ...mapState("travelPurposes", {
      travelPurposes: "items",
      isLoadingTravelPurposes: "isLoading",
    }),
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
  },
  async mounted() {
    await this.ensureTravelPurposes()
  },
  methods: {
    ...mapActions("travelPurposes", { ensureTravelPurposes: "ensure" }),
  },
}
</script>
