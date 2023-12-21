<template>
  <!-- <a
    :href="`/api/expenses/${expenseId}/upload`"
    target="_blank"
  >
    view receipt
  </a> -->
  <v-btn
    :href="`/api/expenses/${expenseId}/upload`"
    target="_blank"
    color="secondary"
  >
    View Receipt
  </v-btn>
</template>

<script>
export default {
  props: {
    expenseId: {
      type: Number,
      required: true,
    },
  },
}
</script>
