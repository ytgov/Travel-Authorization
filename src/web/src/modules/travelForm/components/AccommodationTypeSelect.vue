<template>
  <div class="d-inlin-flex d-md-flex">
    <v-select
      :value="accommodationType"
      :items="accommodationTypes"
      :label="label"
      class="mr-md-4"
      v-bind="$attrs"
      @input="updateAccommodationType"
    ></v-select>
    <v-text-field
      v-if="accommodationType === ACCOMMODATION_TYPES.OTHER"
      :value="accommodationTypeOther"
      :label="`${label} - Other:`"
      v-bind="$attrs"
      @input="updateAccommodationTypeOther"
    ></v-text-field>
  </div>
</template>

<script>
import { isNil } from "lodash"

export const ACCOMMODATION_TYPES = Object.freeze({
  HOTEL: "Hotel",
  PRIVATE: "Private",
  OTHER: "Other:",
})

export default {
  name: "AccommodationTypeSelect",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ACCOMMODATION_TYPES.HOTEL,
    },
    label: {
      type: String,
      default: "Type of Accommodation",
    },
  },
  data() {
    return {
      ACCOMMODATION_TYPES,
      accommodationType: "",
      accommodationTypeOther: "",
      accommodationTypes: Object.values(ACCOMMODATION_TYPES),
    }
  },
  mounted() {
    if (isNil(this.value) || this.accommodationTypes.includes(this.value)) {
      this.accommodationType = this.value
    } else {
      this.accommodationType = ACCOMMODATION_TYPES.OTHER
      this.accommodationTypeOther = this.value
    }
  },
  methods: {
    updateAccommodationType(value) {
      if (value === ACCOMMODATION_TYPES.OTHER) {
        this.$emit("input", this.accommodationTypeOther)
      } else {
        this.$emit("input", value)
      }

      this.accommodationType = value
    },
    updateAccommodationTypeOther(value) {
      this.$emit("input", value)
      this.accommodationTypeOther = value
    },
  },
}
</script>
