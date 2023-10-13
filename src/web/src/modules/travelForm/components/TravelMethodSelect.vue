<template>
  <div class="d-inlin-flex d-md-flex">
    <v-select
      :value="travelMethod"
      :items="travelMethods"
      :label="label"
      class="mr-md-4"
      v-bind="$attrs"
      @change="updateFromTravelMethod"
    ></v-select>
    <v-text-field
      v-if="travelMethod === TRAVEL_METHODS.OTHER"
      v-model="travelMethodOther"
      :label="`${label} - Other:`"
      v-bind="$attrs"
      @change="updateFromTravelMethodOther"
    ></v-text-field>
  </div>
</template>

<script>
// TODO: load from back-end?
export const TRAVEL_METHODS = Object.freeze({
  AIRCRAFT: "Aircraft",
  POOL_VEHICLE: "Pool Vehicle",
  PERSONAL_VEHICLE: "Personal Vehicle",
  RENTAL_VEHICLE: "Rental Vehicle",
  BUS: "Bus",
  OTHER: "Other:",
})

export default {
  name: "TravelMethodSelect",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: TRAVEL_METHODS.AIRCRAFT,
    },
    label: {
      type: String,
      default: "Travel Method",
    },
  },
  data() {
    return {
      TRAVEL_METHODS,
      travelMethods: Object.values(TRAVEL_METHODS),
      travelMethod: "",
      travelMethodOther: "",
    }
  },
  mounted() {
    if (this.travelMethods.includes(this.value)) {
      this.travelMethod = this.value
    } else {
      this.travelMethod = TRAVEL_METHODS.OTHER
      this.travelMethodOther = this.value
    }
  },
  methods: {
    updateFromTravelMethod(value) {
      if (value === TRAVEL_METHODS.OTHER) {
        this.$emit("input", this.travelMethodOther)
      } else {
        this.$emit("input", value)
      }

      this.travelMethod = value
    },
    updateFromTravelMethodOther(value) {
      this.$emit("input", value)
      this.travelMethodOther = value
    },
  },
}
</script>
