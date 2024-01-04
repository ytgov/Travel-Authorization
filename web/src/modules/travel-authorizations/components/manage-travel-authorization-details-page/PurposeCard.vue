<template>
  <v-card elevation="2">
    <v-card-title> Purpose </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-row dense>
            <v-col
              cols="12"
              md="6"
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
            <v-col cols="12">
              <v-text-field
                :value="travelAuthorization.eventName"
                label="Name of meeting/conference, mission, trade fair or course"
                dense
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <!-- Depending on in territory flag we will load a different list of destinations -->
              <v-checkbox
                :value="travelAuthorization.allTravelWithinTerritory"
                label="In Territory?"
                dense
                readonly
              >
              </v-checkbox>
            </v-col>
            <v-col
              cols="12"
              md="9"
            >
              <VReadonlyLocationTextField
                :value="finalDestination.locationId"
                label="Final Destination"
                dense
                outlined
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <h3>Objectives</h3>
              <ul>
                <li>Purpose of attendance</li>
                <li>Relevance and anticipated benefits to branch and Government of Yukon</li>
              </ul>
            </v-col>
            <v-col
              cols="12"
              md="9"
            >
              <v-textarea
                :value="travelAuthorization.benefits"
                label="Objectives"
                rows="10"
                auto-grow
                dense
                outlined
                readonly
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { last } from "lodash"
import { mapState, mapActions, mapGetters } from "vuex"

import VReadonlyLocationTextField from "@/components/VReadonlyLocationTextField"

export default {
  name: "PurposeCard",
  components: {
    VReadonlyLocationTextField,
  },
  data: () => ({}),
  computed: {
    ...mapGetters("travelAuthorization", {
      travelAuthorization: "attributes",
      travelAuthorizationId: "id",
    }),
    ...mapState("travelPurposes", {
      travelPurposes: "items",
      isLoadingTravelPurposes: "isLoading",
    }),
    finalDestination() {
      return (
        last(this.travelAuthorization.stops) || {
          travelAuthorizationId: this.travelAuthorizationId,
        }
      )
    },
    purposeText() {
      const purpose = this.travelPurposes.find((p) => p.id === this.travelAuthorization.purposeId)
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
