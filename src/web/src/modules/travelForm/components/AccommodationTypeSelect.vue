<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-select
        :value="accommodationType"
        :items="accommodationTypes"
        label="Type of Accommodation"
        v-bind="$attrs"
        @input="updateAccommodationType"
      ></v-select>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        v-if="accommodationType === ACCOMMODATION_TYPES.OTHER"
        :value="accommodationTypeOther"
        label="Type of Accommodation - Other:"
        v-bind="$attrs"
        @input="updateAccommodationTypeOther"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
const ACCOMMODATION_TYPES = Object.freeze({
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
    if (this.accommodationTypes.includes(this.value)) {
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
