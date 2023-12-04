<template>
  <v-autocomplete
    :value="value"
    :items="locationsAsSelectorListByRestriction"
    :loading="isLoading"
    auto-select-first
    v-bind="$attrs"
    @input="onInput"
  />
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { isEmpty } from "lodash"

export default {
  name: "LocationsAutocomplete",
  props: {
    value: {
      type: Number,
      default: null,
    },
    inTerritory: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters("locations", ["items", "isLoading", "byProvince"]),
    locationsByRestriction() {
      if (this.inTerritory) {
        return this.byProvince("YT")
      }

      return this.items
    },
    locationsAsSelectorListByRestriction() {
      if (isEmpty(this.locationsByRestriction)) return []

      return this.locationsByRestriction.map(({ id, city, province }) => {
        return {
          value: id,
          text: `${city} (${province})`,
        }
      })
    },
  },
  async mounted() {
    await this.ensure()
  },
  methods: {
    ...mapActions("locations", ["ensure"]),
    onInput(value) {
      this.$emit("input", value)
    },
  },
}
</script>
