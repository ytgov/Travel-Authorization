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
    v-bind="$attrs"
    @input="input"
  ></v-select>
</template>

<script>
import { required } from "@/utils/validators"

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: () => null,
    },
  },
  data: () => ({
    expenseTypes: [],
    loading: true,
  }),
  mounted() {
    this.loading = true
    // TODO: fetch expense types from backend,
    // until then, keep in sync with src/api/models/expense.ts
    this.expenseTypes = ["Transportation", "Accommodations", "Meals & Incidentals"]
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
