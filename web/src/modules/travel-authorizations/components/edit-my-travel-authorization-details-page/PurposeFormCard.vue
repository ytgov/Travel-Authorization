<template>
  <v-card elevation="2">
    <v-card-title> Purpose </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
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
                <v-select
                  v-model="currentTravelAuthorization.purposeId"
                  :items="travelPurposes"
                  :loading="isLoadingTravelPurposes"
                  :rules="[required]"
                  dense
                  item-text="purpose"
                  item-value="id"
                  label="Purpose"
                  outlined
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="currentTravelAuthorization.eventName"
                  :rules="[required]"
                  dense
                  label="Name of meeting/conference, mission, trade fair or course"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <!-- Depending on in territory flag we will load a different list of destinations -->
                <v-checkbox
                  v-model="currentTravelAuthorization.allTravelWithinTerritory"
                  label="In Territory?"
                  dense
                  required
                >
                </v-checkbox>
              </v-col>
              <v-col
                cols="12"
                md="9"
              >
                <v-autocomplete
                  v-model="finalDestination.locationId"
                  :items="destinationsByCurrentFormTravelRestriction"
                  :loading="loadingDestinations"
                  :rules="[required]"
                  clearable
                  dense
                  label="Final Destination"
                  outlined
                  persistent-hint
                  required
                  validate-on-blur
                >
                </v-autocomplete>
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
                  v-model="currentTravelAuthorization.benefits"
                  :rules="[required]"
                  auto-grow
                  dense
                  label="Objectives"
                  outlined
                  rows="10"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { last } from "lodash"
import { mapState, mapActions, mapGetters } from "vuex"

export default {
  name: "PurposeFormCard",
  data: () => ({
    loadingDestinations: false,
    required: (v) => !!v || "This field is required",
  }),
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization"]),
    ...mapGetters("travelAuthorizations", [
      "currentTravelAuthorizationId",
      "destinationsByCurrentFormTravelRestriction",
    ]),
    ...mapState("travelPurposes", {
      travelPurposes: "items",
      isLoadingTravelPurposes: "isLoading",
    }),
    finalDestination: {
      get() {
        return (
          last(this.currentTravelAuthorization.stops) || {
            travelAuthorizationId: this.currentTravelAuthorizationId,
          }
        )
      },
      set(newValue) {
        this.$set(
          this.currentTravelAuthorization.stops,
          this.currentTravelAuthorization.stops.length - 1,
          newValue
        )
      },
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
