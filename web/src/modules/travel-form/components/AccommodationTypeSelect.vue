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

// TODO: fetch accommodation types from backend,
// until then, keep in sync with src/api/services/estimates/bulk-generate.ts
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
    },
    defaultValue: ACCOMMODATION_TYPES.HOTEL,
    label: {
      type: String,
      default: "Type of Accommodation",
    },
  },
  data() {
    const accommodationTypes = Object.values(ACCOMMODATION_TYPES)
    const accommodationType = this.accommodationTypeFromValue(
      accommodationTypes,
      this.value,
      this.defaultValue
    )
    const accommodationTypeOther = this.accommodationTypeOtherFromValue(
      accommodationTypes,
      this.value
    )

    return {
      ACCOMMODATION_TYPES,
      accommodationType,
      accommodationTypeOther,
      accommodationTypes,
    }
  },
  watch: {
    value(newValue) {
      this.accommodationType = this.accommodationTypeFromValue(
        this.accommodationTypes,
        newValue,
        this.defaultValue
      )
      this.accommodationTypeOther = this.accommodationTypeOtherFromValue(
        this.accommodationTypes,
        newValue
      )
    },
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
    accommodationTypeFromValue(accommodationTypes, value, defaultValue) {
      if (isNil(value)) {
        return defaultValue
      }

      if (accommodationTypes.includes(value)) {
        return value
      }

      return ACCOMMODATION_TYPES.OTHER
    },
    accommodationTypeOtherFromValue(accommodationTypes, value) {
      if (accommodationTypes.includes(value)) {
        return ""
      }

      return value
    },
  },
}
</script>
