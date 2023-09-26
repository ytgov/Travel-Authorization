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
        <!-- Depending on in territory flag we will load a different list of destinations -->
        <v-checkbox
          :value="request.allTravelWithinTerritory"
          label="In Territory"
          dense
          required
          @change="updateAllTravelWithinTerritory"
        >
        </v-checkbox>
        <!-- Depending on trip type we will show a completely different form here -->
        <v-select
          :value="tripType"
          :items="tripTypes"
          :rules="[required]"
          label="Trip Type"
          dense
          background-color="white"
          outlined
          @change="updateTripType"
        ></v-select>
        <!-- If accommodation type is other, support text field entry -->
        <v-select
          v-model="accommodationType"
          :items="accommodationTypes"
          :rules="[required]"
          label="Type of Accommodation"
          dense
          background-color="white"
          outlined
        ></v-select>
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
    accommodationType: "Hotel",
    accommodationTypes: ["Hotel", "Private", "Other:"],
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
    updateAllTravelWithinTerritory(value) {
      // TODO: trigger load of different destination list
      this.allTravelWithinTerritory = value
    },
    updateTripType(value) {
      // TODO: update one of several boolean values on the form object
      this.tripType = value
    },
  },
}
</script>
