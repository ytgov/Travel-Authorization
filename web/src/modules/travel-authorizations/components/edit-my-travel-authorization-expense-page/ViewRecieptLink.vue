<template>
  <v-btn
    :href="`/api/expenses/${expenseId}/upload`"
    target="_blank"
    color="primary"
    text
  >
    <span class="text-decoration-underline">View Receipt</span>
    <v-icon right>mdi-open-in-new</v-icon>
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
