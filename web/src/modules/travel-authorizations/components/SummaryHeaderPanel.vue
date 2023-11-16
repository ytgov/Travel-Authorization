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
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState("travelAuthorization", { travelAuthorization: "attributes" }),
    ...mapState("travelPurposes", {
      travelPurposes: "items",
      isLoadingTravelPurposes: "isLoading",
    }),
    finalDestination() {
      return last(this.travelAuthorization.stops) || {}
    },
    initialDestination() {
      return first(this.travelAuthorization.stops) || {}
    },
    purposeText() {
      const purpose = this.travelPurposes.find((p) => p.id === this.travelAuthorization.purposeId)
      return purpose?.purpose || ""
    },
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
    await this.ensureTravelPurposes()
  },
  methods: {
    ...mapActions("travelAuthorization", { ensureTravelAuthorization: "ensure" }),
    ...mapActions("travelPurposes", { ensureTravelPurposes: "ensure" }),
  },
}
</script>
