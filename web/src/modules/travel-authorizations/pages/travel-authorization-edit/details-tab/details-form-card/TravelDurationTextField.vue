<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <div class="d-flex align-start">
        <v-text-field
          :value="value"
          :style="{ minWidth: '80px' }"
          label="# Days"
          dense
          outlined
          disabled
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
        <v-icon
          class="ml-1"
          small
          v-bind="attrs"
          v-on="on"
        >
          mdi-help-circle-outline
        </v-icon>
      </div>
    </template>
    <span>This is computed from the start and end dates of the trip.</span>
  </v-tooltip>
</template>

<script>
import { DateTime } from "luxon"
import { first, isNil, last, max } from "lodash"

export default {
  name: "TravelDurationTextField",
  props: {
    value: {
      type: Number,
      default: () => 0,
    },
    stops: {
      type: Array,
      required: true,
    },
  },
  computed: {
    originDestination() {
      return first(this.stops) || {}
    },
    finalDestination() {
      return last(this.stops) || {}
    },
    travelDuration() {
      return this.computeTravelDuration(this.originDestination, this.finalDestination)
    },
  },
  watch: {
    travelDuration(newValue) {
      this.$emit("input", newValue)
    },
  },
  mounted() {
    // Backwards compatibility feature, fills missing value not previously set
    // but all dates are set, you still need to save the form to persist this value
    this.$emit("input", this.travelDuration)
  },
  methods: {
    computeTravelDuration(originDestination, finalDestination) {
      if (isNil(originDestination.departureDate) || isNil(finalDestination.departureDate)) {
        return null
      }

      const departureDateOrigin = DateTime.fromISO(originDestination.departureDate)
      const departureDateFinal = DateTime.fromISO(finalDestination.departureDate)
      const timeDifference = departureDateFinal.diff(departureDateOrigin, "days")
      return max([0, timeDifference.days])
    },
  },
}
</script>
