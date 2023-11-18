<template>
  <v-text-field
    :value="locationText"
    :items="items"
    :loading="isLoading"
    readonly
    v-bind="$attrs"
  />
</template>

<script>
import { isNil } from "lodash"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "VReadonlyLocationTextField",
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapGetters("locations", ["items", "isLoading"]),
    locationText() {
      const location = this.items.find((location) => location.id === this.value)
      if (isNil(location)) return ""

      const { city, province } = location
      return `${city} (${province})`
    },
  },
  async mounted() {
    await this.ensure()
  },
  methods: {
    ...mapActions("locations", ["ensure"]),
  },
}
</script>
