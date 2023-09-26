<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-row dense>
      <v-col
        cols="12"
        md="2"
      >
        <v-select
          v-model="request.purposeId"
          :items="purposes"
          :loading="loadingPurposes"
          :rules="[required]"
          background-color="white"
          dense
          item-text="purpose"
          item-value="id"
          label="Purpose"
          outlined
          required
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="finalDestination.locationId"
          :items="destinationsByRequestTravelRestriction"
          :loading="loadingDestinations"
          :rules="[required]"
          background-color="white"
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
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          v-model="initialDestination.departureDate"
          :rules="[required]"
          text="Start Date"
          required
          validate-on-blur
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          v-model="finalDestination.departureDate"
          :min="initialDestination.departureDate"
          :rules="[
            required,
            greaterThanOrEqualToDate(initialDestination.departureDate, 'start date'),
          ]"
          text="End Date"
          required
          validate-on-blur
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { first, last } from "lodash"
import { mapState, mapActions, mapGetters } from "vuex"

import DatePicker from "@/components/Utils/DatePicker"

export default {
  name: "SummaryHeaderForm",
  components: {
    DatePicker,
  },
  data: () => ({
    loadingPurposes: false,
    loadingDestinations: false,
    required: (v) => !!v || "This field is required",
    greaterThanOrEqualToDate: (b, label) => (a) =>
      new Date(b) >= new Date(a) || `This field must be greater than or equal to ${b || label}`,
  }),
  computed: {
    ...mapState("travelForm", ["request", "purposes", "destinationsByRequestTravelRestriction"]),
    ...mapGetters("travelForm", ["destinationsByRequestTravelRestriction"]),
    finalDestination: {
      get() {
        return last(this.request.stops) || {}
      },
      set(newValue) {
        this.$set(this.request.stops, this.request.stops.length - 1, newValue)
      },
    },
    initialDestination: {
      get() {
        return first(this.request.stops) || {}
      },
      set(newValue) {
        this.$set(this.request.stops, 0, newValue)
      },
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
    ...mapActions("travelForm", ["loadPurposes", "loadDestinations"]),
  },
}
</script>
