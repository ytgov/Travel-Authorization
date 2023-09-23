<template>
  <v-card
    elevation="2"
    class="default"
  >
    <v-card-title> Details </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-checkbox
          :input-value="request.allTravelWithinTerritory"
          label="In Territory"
          dense
          required
          @change="updateAllTravelWithinTerritory"
        >
        </v-checkbox>
        <v-select
          :input-value="tripType"
          :items="tripTypes"
          :rules="[required]"
          label="Trip Type"
          dense
          background-color="white"
          outlined
          @change="updateTripType"
        ></v-select>
        <!-- Depending on trip type we will show a completely different form here -->
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            TODO
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "PurposeFormCard",
  data: () => ({
    loadingPurposes: false,
    loadingDestinations: false,
    required: (v) => !!v || "This field is required",
    tripTypes: ["Round Trip", "One Way", "Muli-Destination"],
    tripType: "One Way",
  }),
  computed: {
    ...mapState("travelForm", ["request", "destinations"]),
  },
  async mounted() {
    this.loadingDestinations = true
    await Promise.all([
      this.loadDestinations().finally(() => {
        this.loadingDestinations = false
      }),
    ])
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    updateAllTravelWithinTerritory() {
      // trigger load of different destination list
    },
    updateTripType() {
      // update one of several boolean values on the form object
    },
  },
}
</script>
