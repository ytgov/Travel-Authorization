<template>
  <v-tab
    :to="{
      name: 'ManageTravelAuthorizationExpensePage',
      params: { travelAuthorizationId },
    }"
  >
    Expense
  </v-tab>
</template>

<script>
export default {
  name: "ExpenseTab",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
}
</script>
