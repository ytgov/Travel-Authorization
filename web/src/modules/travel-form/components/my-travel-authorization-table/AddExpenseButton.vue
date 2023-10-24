<template>
  <v-btn
    color="primary"
    @click.stop="addExpense"
  >
    Add Expense
  </v-btn>
</template>

<script>
export default {
  name: "AddExpenseButton",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    addExpense() {
      alert("TODO: add expense for travel authorization " + this.travelAuthorizationId)
    },
  },
}
</script>
