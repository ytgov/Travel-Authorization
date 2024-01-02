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

import { EXPENSE_TYPES } from "@/api/expenses-api"

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: () => null,
    },
    expenseTypes: {
      type: Array,
      default: () => Object.values(EXPENSE_TYPES),
    },
  },
  data: () => ({
    loading: true,
  }),
  mounted() {
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
