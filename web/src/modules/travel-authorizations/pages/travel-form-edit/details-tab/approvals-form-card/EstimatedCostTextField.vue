<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <div class="d-flex align-start">
        <v-text-field
          :value="formatCurrency(estimatedCost)"
          :loading="loading"
          label="Estimated Cost"
          dense
          disabled
          outlined
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
    <span>This is computed with data from the Estimate tab.</span>
  </v-tooltip>
</template>

<script>
import { sumBy } from "lodash"

export default {
  name: "EstimatedCostTextField",
  props: {
    estimates: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    estimatedCost() {
      return sumBy(this.estimates, "cost")
    },
  },
  methods: {
    formatCurrency(amount) {
      const formatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      })
      return formatter.format(amount)
    },
  },
}
</script>
