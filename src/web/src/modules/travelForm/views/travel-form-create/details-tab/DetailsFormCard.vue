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
          background-color="white"
          dense
          outlined
          required
          @change="updateTripType"
        ></v-select>
        <!-- If accommodation type is other, support text field entry -->
        <v-select
          v-model="request.accommodationType"
          :items="accommodationTypes"
          :rules="[required]"
          label="Type of Accommodation"
          background-color="white"
          dense
          outlined
          required
        ></v-select>
        <v-text-field
          v-if="request.accommodationType === ACCOMMODATION_TYPES.OTHER"
          v-model="accommodationTypeOther"
          :rules="[required]"
          label="Type of Accommodation - Other:"
          background-color="white"
          dense
          outlined
          required
        ></v-text-field>

        <v-text-field
          v-model="request.travelDuration"
          :rules="[requred, isNumber]"
          label="# Days"
          background-color="white"
          dense
          outlined
          required
        ></v-text-field>
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

const TRIP_TYPES = Object.freeze({
  ROUND_TRIP: "Round Trip",
  ONE_WAY: "One Way",
  MULI_DESTINATION: "Muli-Destination",
})

const ACCOMMODATION_TYPES = Object.freeze({
  HOTEL: "Hotel",
  PRIVATE: "Private",
  OTHER: "Other:",
})

export default {
  name: "PurposeFormCard",
  data: () => ({
    loadingPurposes: false,
    loadingDestinations: false,
    ACCOMMODATION_TYPES,
    accommodationType: ACCOMMODATION_TYPES.HOTEL,
    accommodationTypeOther: "",
    accommodationTypes: Object.values(ACCOMMODATION_TYPES),
    TRIP_TYPES,
    tripTypes: Object.values(TRIP_TYPES),
    tripType: TRIP_TYPES.ONE_WAY,
    required: (v) => !!v || "This field is required",
    isNumber: (v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number"
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
