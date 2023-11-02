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
                label="Purpose"
                dense
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :value="currentTravelAuthorization.eventName"
                label="Name of meeting/conference, mission, trade fair or course"
                dense
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                :value="finalDestinationText"
                label="Final Destination"
                dense
                outlined
                readonly
              ></v-text-field>
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
                :value="currentTravelAuthorization.benefits"
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

export default {
  name: "PurposeCard",
  data: () => ({
    loadingPurposes: false,
    loadingDestinations: false,
  }),
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization", "purposes"]),
    ...mapGetters("travelAuthorizations", ["currentTravelAuthorizationId", "destinationsByCurrentFormTravelRestriction"]),
    finalDestination() {
      return last(this.currentTravelAuthorization.stops) || { travelAuthorizationId: this.currentTravelAuthorizationId }
    },
    purposeText() {
      const purpose = this.purposes.find((p) => p.id === this.currentTravelAuthorization.purposeId)
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
    ...mapActions("travelAuthorizations", ["loadPurposes", "loadDestinations"]),
  },
}
</script>
