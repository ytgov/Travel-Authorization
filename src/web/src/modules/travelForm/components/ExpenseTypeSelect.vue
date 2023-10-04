<template>
  <v-select
    :value="value"
    :items="expenseTypes"
    :loading="loading"
    :rules="[required]"
    label="Expense Type"
    dense
    outlined
    required
    @input="input"
    v-bind="$attrs"
  ></v-select>
</template>

<script>
import { required } from "@/utils/validators"

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
    },
  },
  data: () => ({
    expenseTypes: [],
    loading: true,
  }),
  mounted() {
    this.loading = true
    // TODO: fetch expense types from backend
    this.expenseTypes = ["Flights", "Accommodations", "Meals & Incidentals"]
    this.loading = false
  },
  methods: {
    required,
    input(value) {
      this.$emit("input", value)
    },
  },
}
</script>
